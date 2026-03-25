import { useState, useRef } from "react";
import { Star, Camera, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useReviews } from "@/contexts/ReviewContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ReviewSectionProps {
  productName: string;
}

const MAX_PHOTOS = 4;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = (h / w) * maxDim; w = maxDim; }
          else { w = (w / h) * maxDim; h = maxDim; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const StarRating = ({
  rating,
  onRate,
  interactive = false,
  size = "h-4 w-4",
}: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
  size?: string;
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} transition-colors ${
            interactive ? "cursor-pointer" : ""
          } ${
            star <= (hover || rating)
              ? "fill-primary text-primary"
              : "text-muted-foreground/30"
          }`}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  );
};

const PhotoLightbox = ({ src }: { src: string }) => (
  <Dialog>
    <DialogTrigger asChild>
      <img
        src={src}
        alt="Review photo"
        className="h-20 w-20 rounded-lg object-cover cursor-pointer border border-border hover:opacity-80 transition-opacity"
      />
    </DialogTrigger>
    <DialogContent className="max-w-2xl p-2 bg-background">
      <img src={src} alt="Review photo full" className="w-full h-auto rounded-lg" />
    </DialogContent>
  </Dialog>
);

const ReviewSection = ({ productName }: ReviewSectionProps) => {
  const { getProductReviews, getAverageRating, addReview } = useReviews();
  const { user, isLoggedIn } = useAuth();
  const reviews = getProductReviews(productName);
  const avgRating = getAverageRating(productName);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_PHOTOS} photos allowed`);
      return;
    }

    const selected = files.slice(0, remaining);
    const oversized = selected.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      toast.error("Each photo must be under 2MB");
      return;
    }

    const invalid = selected.filter((f) => !f.type.startsWith("image/"));
    if (invalid.length > 0) {
      toast.error("Only image files are allowed");
      return;
    }

    setUploading(true);
    try {
      const compressed = await Promise.all(selected.map(compressImage));
      setPhotos((prev) => [...prev, ...compressed].slice(0, MAX_PHOTOS));
    } catch {
      toast.error("Failed to process images");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!title.trim() || !comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    addReview({
      productName,
      userName: user?.name || "Anonymous",
      rating,
      title: title.trim().slice(0, 100),
      comment: comment.trim().slice(0, 500),
      photos: photos.length > 0 ? photos : undefined,
    });

    setRating(0);
    setTitle("");
    setComment("");
    setPhotos([]);
    setShowForm(false);
    toast.success("Review submitted! Thank you 🎉");
  };

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    star: r,
    count: reviews.filter((rev) => rev.rating === r).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Customer Reviews ({reviews.length})
        </h2>
        <Button
          onClick={() => {
            if (!isLoggedIn) {
              toast.error("Please login to write a review");
              return;
            }
            setShowForm(!showForm);
          }}
          size="sm"
        >
          Write a Review
        </Button>
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="flex gap-8 items-start bg-secondary/50 rounded-xl p-5">
          <div className="text-center">
            <p className="font-heading text-4xl font-bold text-foreground">
              {avgRating.toFixed(1)}
            </p>
            <StarRating rating={Math.round(avgRating)} size="h-5 w-5" />
            <p className="text-xs text-muted-foreground mt-1 font-body">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingCounts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-muted-foreground font-body">{star}</span>
                <Star className="h-3 w-3 fill-primary text-primary" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: reviews.length
                        ? `${(count / reviews.length) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
                <span className="w-6 text-right text-muted-foreground font-body text-xs">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-border rounded-xl p-5 space-y-4 bg-card overflow-hidden"
          >
            <div>
              <label className="text-sm font-medium text-foreground font-body mb-2 block">
                Your Rating
              </label>
              <StarRating rating={rating} onRate={setRating} interactive size="h-7 w-7" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground font-body mb-1 block">
                Review Title
              </label>
              <Input
                placeholder="Summarize your experience"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground font-body mb-1 block">
                Your Review
              </label>
              <Textarea
                placeholder="Tell others what you think about this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                rows={3}
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="text-sm font-medium text-foreground font-body mb-2 block">
                Add Photos <span className="text-muted-foreground font-normal">(optional, max {MAX_PHOTOS})</span>
              </label>
              <div className="flex flex-wrap gap-3 items-center">
                {photos.map((photo, i) => (
                  <div key={i} className="relative group/photo">
                    <img
                      src={photo}
                      alt={`Upload ${i + 1}`}
                      className="h-20 w-20 rounded-lg object-cover border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {photos.length < MAX_PHOTOS && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-colors text-muted-foreground hover:text-primary disabled:opacity-50"
                  >
                    {uploading ? (
                      <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Camera className="h-5 w-5" />
                        <span className="text-[10px] font-body">Add</span>
                      </>
                    )}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit}>Submit Review</Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setPhotos([]); }}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review List */}
      {reviews.length === 0 ? (
        <p className="text-muted-foreground font-body text-center py-8">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border rounded-xl p-4 space-y-2 bg-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary font-heading">
                      {review.userName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground font-body">
                      {review.userName}
                    </p>
                    <p className="text-xs text-muted-foreground font-body">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <h4 className="font-heading font-semibold text-sm text-foreground">
                {review.title}
              </h4>
              <p className="text-sm text-muted-foreground font-body">{review.comment}</p>

              {/* Review Photos */}
              {review.photos && review.photos.length > 0 && (
                <div className="flex gap-2 pt-1">
                  {review.photos.map((photo, i) => (
                    <PhotoLightbox key={i} src={photo} />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;

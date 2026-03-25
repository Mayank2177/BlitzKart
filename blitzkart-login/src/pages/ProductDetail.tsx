import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import { allProducts } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useReviews } from "@/contexts/ReviewContext";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ArrowLeft, Star } from "lucide-react";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { productName } = useParams();
  const decodedName = decodeURIComponent(productName || "");
  const product = allProducts.find((p) => p.name === decodedName);
  const { items, addItem, updateQuantity } = useCart();
  const { getAverageRating, getProductReviews } = useReviews();

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-5xl mb-4">😕</p>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Product not found</h1>
          <Link to="/products" className="text-primary hover:underline font-body">← Back to products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const cartItem = items.find((i) => i.name === product.name);
  const quantity = cartItem?.quantity ?? 0;
  const avgRating = getAverageRating(product.name);
  const reviewCount = getProductReviews(product.name).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-body mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-secondary/30 rounded-2xl p-8 flex items-center justify-center">
            {product.discount && (
              <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-lg z-10">
                {product.discount}% OFF
              </span>
            )}
            <img src={product.image} alt={product.name} className="max-h-72 object-contain" />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <p className="text-sm text-primary font-body font-medium mb-1">{product.category}</p>
              <h1 className="font-heading text-3xl font-bold text-foreground">{product.name}</h1>
              <p className="text-muted-foreground font-body mt-1">{product.unit}</p>
            </div>

            {reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-4 w-4 ${s <= Math.round(avgRating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground font-body">
                  {avgRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}

            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold text-foreground">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
              )}
              {product.discount && (
                <span className="text-sm font-medium text-primary font-body">Save {product.discount}%</span>
              )}
            </div>

            <div className="pt-2">
              {quantity === 0 ? (
                <Button size="lg" onClick={() => addItem({ name: product.name, price: product.price, originalPrice: product.originalPrice, unit: product.unit, image: product.image })}>
                  <Plus className="h-4 w-4 mr-2" /> Add to Cart
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <Button size="icon" variant="outline" onClick={() => updateQuantity(product.name, quantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-heading font-bold text-foreground w-8 text-center">{quantity}</span>
                  <Button size="icon" onClick={() => updateQuantity(product.name, quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <ReviewSection productName={product.name} />
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;

import React, { createContext, useContext, useState, useCallback } from "react";

export interface Review {
  id: string;
  productName: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  photos?: string[]; // base64 data URLs
  createdAt: number;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "createdAt">) => void;
  getProductReviews: (productName: string) => Review[];
  getAverageRating: (productName: string) => number;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

const STORAGE_KEY = "bk-reviews";

const seedReviews: Review[] = [
  { id: "s1", productName: "Organic Bananas", userName: "Rahul S.", rating: 5, title: "Very fresh!", comment: "Received perfectly ripe bananas. Will order again.", createdAt: Date.now() - 86400000 * 3 },
  { id: "s2", productName: "Organic Bananas", userName: "Priya M.", rating: 4, title: "Good quality", comment: "Slightly green but ripened well in a day.", createdAt: Date.now() - 86400000 * 5 },
  { id: "s3", productName: "Farm Fresh Eggs", userName: "Amit K.", rating: 5, title: "Best eggs!", comment: "Large sized, fresh and all intact on delivery.", createdAt: Date.now() - 86400000 * 2 },
  { id: "s4", productName: "Basmati Rice", userName: "Sneha R.", rating: 4, title: "Aromatic rice", comment: "Good quality basmati. Cooks perfectly every time.", createdAt: Date.now() - 86400000 * 7 },
  { id: "s5", productName: "Toned Milk", userName: "Vikram P.", rating: 5, title: "Fresh delivery", comment: "Always delivered cold and fresh. Great taste.", createdAt: Date.now() - 86400000 },
  { id: "s6", productName: "Red Apples", userName: "Anjali D.", rating: 3, title: "Decent", comment: "Apples were okay, could be crunchier.", createdAt: Date.now() - 86400000 * 4 },
];

export const ReviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : seedReviews;
    }
    return seedReviews;
  });

  const addReview = useCallback((review: Omit<Review, "id" | "createdAt">) => {
    const newReview: Review = {
      ...review,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setReviews((prev) => {
      const updated = [newReview, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getProductReviews = useCallback(
    (productName: string) => reviews.filter((r) => r.productName === productName),
    [reviews]
  );

  const getAverageRating = useCallback(
    (productName: string) => {
      const productReviews = reviews.filter((r) => r.productName === productName);
      if (productReviews.length === 0) return 0;
      return productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    },
    [reviews]
  );

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getProductReviews, getAverageRating }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewProvider");
  return ctx;
};

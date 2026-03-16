import ProductCard from "./ProductCard";
import { allProducts } from "@/data/products";
import { Link } from "react-router-dom";

const featured = allProducts.filter((p) => p.discount).slice(0, 8);

const FeaturedProducts = () => {
  return (
    <section className="py-12 md:py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Best Sellers 🔥
          </h2>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline font-body">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {featured.map((p) => (
            <ProductCard key={p.name} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

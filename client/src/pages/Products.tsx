import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { allProducts, categories } from "@/data/products";
import { motion } from "framer-motion";

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";
  const searchParam = searchParams.get("q") || "";
  const [activeCategory, setActiveCategory] = useState(categoryParam);

  const filtered = allProducts.filter((p) => {
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = searchParam
      ? p.name.toLowerCase().includes(searchParam.toLowerCase()) ||
        p.category.toLowerCase().includes(searchParam.toLowerCase())
      : true;
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {searchParam && (
          <p className="text-muted-foreground mb-4 font-body">
            Showing results for "<span className="text-foreground font-medium">{searchParam}</span>"
            {" "}({filtered.length} items)
          </p>
        )}

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors font-body ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="font-heading text-xl font-bold text-foreground mb-2">No products found</h2>
            <p className="text-muted-foreground font-body">Try a different search or category</p>
            <Link to="/" className="text-primary hover:underline mt-4 inline-block font-body">
              ← Back to home
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {filtered.map((p) => (
              <ProductCard key={p.name} {...p} />
            ))}
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Products;

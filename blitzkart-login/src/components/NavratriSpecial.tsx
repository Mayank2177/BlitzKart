import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { allProducts } from "@/data/products";
import { Link } from "react-router-dom";

// Navratri-themed products: puja essentials, sweets, festive items
const navratriKeywords = [
  "oil", "milk", "banana", "apple", "nuts", "yogurt", "rice",
  "atta", "juice", "chocolate", "popcorn", "biscuit",
  "air freshener", "face mask", "body lotion", "lipstick", "nail polish",
];

const navratriProducts = allProducts.filter((p) =>
  navratriKeywords.some((kw) => p.name.toLowerCase().includes(kw))
).slice(0, 10).map((p) => ({
  ...p,
  originalPrice: p.originalPrice || Math.round(p.price / 0.6),
  price: Math.round(p.price * 0.6),
  discount: 40,
}));

const NavratriSpecial = () => {
  return (
    <section className="py-12 relative overflow-hidden">
      {/* Festive background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-yellow-950/20" />
      <div className="absolute top-4 left-8 text-4xl opacity-60 animate-pulse">🪔</div>
      <div className="absolute top-8 right-12 text-3xl opacity-50 animate-pulse" style={{ animationDelay: "0.5s" }}>🌺</div>
      <div className="absolute bottom-6 left-1/4 text-3xl opacity-40 animate-pulse" style={{ animationDelay: "1s" }}>✨</div>
      <div className="absolute bottom-4 right-1/3 text-4xl opacity-50 animate-pulse" style={{ animationDelay: "0.7s" }}>🪔</div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium font-body mb-3">
            <span>🕉️</span>
            <span>Limited Time Festival Offers</span>
            <span>🕉️</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Navratri Special 🪔
          </h2>
          <p className="text-muted-foreground font-body mt-2 max-w-lg mx-auto">
            Celebrate the nine divine nights with special deals on puja essentials, sweets, and festive must-haves!
          </p>
        </motion.div>

        {/* Festive countdown / badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20">
            <div className="text-center">
              <p className="text-xl font-bold font-heading">🎊 Up to 40% OFF</p>
              <p className="text-xs opacity-90 font-body">On festive essentials • Free delivery on ₹299+</p>
            </div>
          </div>
        </motion.div>

        {/* Products grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {navratriProducts.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: 0.1 + i * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ProductCard {...p} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-heading font-bold text-sm transition-colors active:scale-[0.97]"
          >
            View All Navratri Deals →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default NavratriSpecial;

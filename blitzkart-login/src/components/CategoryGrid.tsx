import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import catGrocery from "@/assets/cat-grocery.jpg";
import catSnacks from "@/assets/cat-snacks.jpg";
import catHousehold from "@/assets/cat-household.jpg";
import catElectronics from "@/assets/cat-electronics.jpg";
import catBeauty from "@/assets/cat-beauty.jpg";

const categories = [
  { name: "Grocery & Kitchen", image: catGrocery },
  { name: "Snacks & Drinks", image: catSnacks },
  { name: "Household Items", image: catHousehold },
  { name: "Electronics", image: catElectronics },
  { name: "Beauty Products", image: catBeauty },
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
              className="relative rounded-xl overflow-hidden cursor-pointer group aspect-square"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 text-sm md:text-base font-heading font-semibold text-white drop-shadow-lg">
                {cat.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;

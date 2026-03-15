import { motion } from "framer-motion";

const categories = [
  { name: "Fruits & Veggies", emoji: "🥦", color: "bg-green-500/10" },
  { name: "Dairy & Eggs", emoji: "🥛", color: "bg-blue-500/10" },
  { name: "Snacks", emoji: "🍿", color: "bg-amber-500/10" },
  { name: "Beverages", emoji: "🧃", color: "bg-red-500/10" },
  { name: "Meat & Fish", emoji: "🍗", color: "bg-rose-500/10" },
  { name: "Bakery", emoji: "🍞", color: "bg-orange-500/10" },
  { name: "Frozen", emoji: "🧊", color: "bg-cyan-500/10" },
  { name: "Personal Care", emoji: "🧴", color: "bg-purple-500/10" },
];

const CategoryGrid = () => {
  return (
    <section className="container py-12">
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`${cat.color} rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer border border-border`}
          >
            <span className="text-3xl">{cat.emoji}</span>
            <span className="text-xs font-body font-medium text-foreground text-center leading-tight">{cat.name}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;

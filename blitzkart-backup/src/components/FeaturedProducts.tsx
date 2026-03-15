import ProductCard from "./ProductCard";

const products = [
  { name: "Organic Bananas", price: 45, originalPrice: 60, unit: "1 dozen", emoji: "🍌", discount: 25 },
  { name: "Farm Fresh Eggs", price: 89, unit: "12 pcs", emoji: "🥚" },
  { name: "Whole Wheat Bread", price: 42, originalPrice: 55, unit: "400g", emoji: "🍞", discount: 24 },
  { name: "Amul Toned Milk", price: 30, unit: "500ml", emoji: "🥛" },
  { name: "Red Apples", price: 120, originalPrice: 160, unit: "1 kg", emoji: "🍎", discount: 25 },
  { name: "Lays Classic Chips", price: 20, unit: "52g", emoji: "🥔" },
  { name: "Fresh Tomatoes", price: 35, unit: "500g", emoji: "🍅" },
  { name: "Greek Yogurt", price: 75, originalPrice: 99, unit: "200g", emoji: "🫙", discount: 24 },
];

const FeaturedProducts = () => {
  return (
    <section className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          Best Sellers 🔥
        </h2>
        <button className="text-sm font-body font-medium text-primary hover:underline">
          View all →
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.name} {...p} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;

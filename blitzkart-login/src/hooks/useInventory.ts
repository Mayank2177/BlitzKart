import { useState } from "react";
import { Product } from "@/types/inventory";
import { mockProducts } from "@/data/mockInventory";
import { toast } from "sonner";

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "ok">("all");

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    if (filter === "low") return matchesSearch && p.stock < p.minStock;
    if (filter === "ok") return matchesSearch && p.stock >= p.minStock;
    return matchesSearch;
  });

  const lowStockCount = products.filter((p) => p.stock < p.minStock).length;
  const totalItems = products.reduce((sum, p) => sum + p.stock, 0);

  const adjustStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, stock: Math.max(0, p.stock + delta), lastUpdated: "just now" }
          : p
      )
    );
    toast.success("Stock updated");
  };

  return {
    products,
    filtered,
    search,
    setSearch,
    filter,
    setFilter,
    lowStockCount,
    totalItems,
    adjustStock,
  };
};

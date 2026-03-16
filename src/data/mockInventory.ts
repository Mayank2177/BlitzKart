import { Product } from "@/types/inventory";

export const mockProducts: Product[] = [
  { id: "1", name: "Organic Bananas", category: "Fruits", sku: "FRU-001", stock: 234, minStock: 50, price: 39, warehouse: "WH-Mumbai", lastUpdated: "2 min ago" },
  { id: "2", name: "Amul Toned Milk 1L", category: "Dairy", sku: "DAI-012", stock: 12, minStock: 100, price: 58, warehouse: "WH-Mumbai", lastUpdated: "5 min ago" },
  { id: "3", name: "Maggi Noodles Pack", category: "Snacks", sku: "SNK-045", stock: 567, minStock: 200, price: 14, warehouse: "WH-Delhi", lastUpdated: "1 min ago" },
  { id: "4", name: "Aashirvaad Atta 5kg", category: "Staples", sku: "STP-003", stock: 45, minStock: 80, price: 289, warehouse: "WH-Bangalore", lastUpdated: "10 min ago" },
  { id: "5", name: "Red Bull 250ml", category: "Beverages", sku: "BEV-078", stock: 890, minStock: 150, price: 125, warehouse: "WH-Mumbai", lastUpdated: "30 sec ago" },
  { id: "6", name: "Curd 400g", category: "Dairy", sku: "DAI-034", stock: 8, minStock: 60, price: 35, warehouse: "WH-Delhi", lastUpdated: "3 min ago" },
  { id: "7", name: "Onions 1kg", category: "Vegetables", sku: "VEG-011", stock: 320, minStock: 100, price: 42, warehouse: "WH-Bangalore", lastUpdated: "7 min ago" },
  { id: "8", name: "Coca Cola 750ml", category: "Beverages", sku: "BEV-009", stock: 22, minStock: 50, price: 40, warehouse: "WH-Mumbai", lastUpdated: "15 min ago" },
  { id: "9", name: "Eggs (12 pack)", category: "Dairy", sku: "DAI-056", stock: 156, minStock: 80, price: 72, warehouse: "WH-Delhi", lastUpdated: "1 min ago" },
  { id: "10", name: "Lays Classic 52g", category: "Snacks", sku: "SNK-023", stock: 3, minStock: 100, price: 20, warehouse: "WH-Bangalore", lastUpdated: "20 min ago" },
];

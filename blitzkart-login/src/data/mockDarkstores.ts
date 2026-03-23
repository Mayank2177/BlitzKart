import { allProducts, categories } from "./products";

export interface Darkstore {
  id: string;
  name: string;
  area: string;
  city: string;
}

export const darkstores: Darkstore[] = [
  // Kolkata
  { id: "DS-001", name: "BlitzKart Howrah Hub", area: "Howrah", city: "Kolkata" },
  { id: "DS-002", name: "BlitzKart Salt Lake Store", area: "Bidhannagar (Salt Lake)", city: "Kolkata" },
  { id: "DS-003", name: "BlitzKart New Town Depot", area: "New Town", city: "Kolkata" },
  { id: "DS-004", name: "BlitzKart Sealdah Point", area: "Sealdah", city: "Kolkata" },
  { id: "DS-005", name: "BlitzKart Barrackpore Hub", area: "Barrackpore", city: "Kolkata" },
  // Delhi
  { id: "DS-006", name: "BlitzKart Delhi Central", area: "Connaught Place", city: "Delhi" },
  { id: "DS-007", name: "BlitzKart Delhi South", area: "Saket", city: "Delhi" },
  // Chennai
  { id: "DS-008", name: "BlitzKart Chennai Hub", area: "T. Nagar", city: "Chennai" },
  { id: "DS-009", name: "BlitzKart Chennai East", area: "Adyar", city: "Chennai" },
  // Bangalore
  { id: "DS-010", name: "BlitzKart Bangalore Central", area: "Koramangala", city: "Bangalore" },
  { id: "DS-011", name: "BlitzKart Bangalore North", area: "Hebbal", city: "Bangalore" },
  // Maharashtra
  { id: "DS-012", name: "BlitzKart Mumbai West", area: "Andheri West", city: "Mumbai" },
  { id: "DS-013", name: "BlitzKart Pune Hub", area: "Hinjewadi", city: "Pune" },
  { id: "DS-014", name: "BlitzKart Nagpur Store", area: "Dharampeth", city: "Nagpur" },
];

// Generate mock product stock per darkstore
export interface DarkstoreProduct {
  productName: string;
  category: string;
  price: number;
  stock: number;
  darkstoreId: string;
  darkstoreName: string;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const darkstoreProducts: DarkstoreProduct[] = darkstores.flatMap((ds, dsIndex) =>
  allProducts.map((p, pIndex) => ({
    productName: p.name,
    category: p.category,
    price: p.price,
    stock: Math.floor(seededRandom(dsIndex * 100 + pIndex) * 150) + 5,
    darkstoreId: ds.id,
    darkstoreName: ds.name,
  }))
);

export function getStockByDarkstore() {
  return darkstores.map((ds) => {
    const products = darkstoreProducts.filter((p) => p.darkstoreId === ds.id);
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalProducts = products.length;
    const lowStock = products.filter((p) => p.stock < 20).length;
    const categoryBreakdown = categories.map((cat) => ({
      category: cat,
      count: products.filter((p) => p.category === cat).length,
      stock: products.filter((p) => p.category === cat).reduce((s, p) => s + p.stock, 0),
    }));
    return { ...ds, totalStock, totalProducts, lowStock, categoryBreakdown };
  });
}

// Generate mock orders across all darkstores
export interface MockAdminOrder {
  id: string;
  customerName: string;
  phone: string;
  items: { name: string; qty: number; price: number }[];
  totalAmount: number;
  deliveryFee: number;
  status: "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  darkstoreId: string;
  darkstoreName: string;
  city: string;
  placedAt: number;
  address: string;
}

const customerNames = [
  "Aarav Sharma", "Priya Patel", "Rohan Gupta", "Sneha Reddy", "Vikram Singh",
  "Ananya Joshi", "Karan Mehta", "Diya Nair", "Arjun Kumar", "Meera Iyer",
  "Rahul Verma", "Pooja Das", "Aditya Rao", "Kavya Mishra", "Nikhil Jain",
  "Simran Kaur", "Amit Choudhury", "Riya Banerjee", "Siddharth Pillai", "Neha Tiwari",
];

const addresses = [
  "12, MG Road, Near Central Mall",
  "45, Sector 5, Block B, 2nd Floor",
  "78, Lajpat Nagar, Opposite Metro Station",
  "23, Whitefield Main Road, Apt 301",
  "56, Park Street, Lane 3",
  "91, Bandra Link Road, Flat 12A",
  "34, Jubilee Hills, Rd No 5",
  "67, Civil Lines, Near Clock Tower",
];

const statuses: MockAdminOrder["status"][] = ["confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

export function generateMockOrders(): MockAdminOrder[] {
  const orders: MockAdminOrder[] = [];
  const now = Date.now();

  for (let i = 0; i < 50; i++) {
    const ds = darkstores[Math.floor(seededRandom(i * 7) * darkstores.length)];
    const numItems = 1 + Math.floor(seededRandom(i * 13) * 4);
    const items: MockAdminOrder["items"] = [];

    for (let j = 0; j < numItems; j++) {
      const product = allProducts[Math.floor(seededRandom(i * 17 + j * 3) * allProducts.length)];
      items.push({ name: product.name, qty: 1 + Math.floor(seededRandom(i * 23 + j) * 3), price: product.price });
    }

    const totalAmount = items.reduce((s, item) => s + item.price * item.qty, 0);
    const deliveryFee = totalAmount >= 100 ? 0 : 25;
    const statusIndex = Math.floor(seededRandom(i * 31) * statuses.length);
    const hoursAgo = Math.floor(seededRandom(i * 41) * 72);

    orders.push({
      id: `ORD-${(1000 + i).toString()}`,
      customerName: customerNames[Math.floor(seededRandom(i * 11) * customerNames.length)],
      phone: `+91 ${9000000000 + Math.floor(seededRandom(i * 19) * 999999999)}`,
      items,
      totalAmount,
      deliveryFee,
      status: statuses[statusIndex],
      darkstoreId: ds.id,
      darkstoreName: ds.name,
      city: ds.city,
      placedAt: now - hoursAgo * 60 * 60 * 1000,
      address: addresses[Math.floor(seededRandom(i * 29) * addresses.length)],
    });
  }

  return orders.sort((a, b) => b.placedAt - a.placedAt);
}

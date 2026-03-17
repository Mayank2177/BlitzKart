import { Order } from "@/types/dispatch";

export const riders = ["Rahul S.", "Priya K.", "Amit D.", "Sneha M.", "Vikram J."];

export const mockOrders: Order[] = [
  { id: "BK-10234", customer: "Arjun Mehta", address: "Sector 62, Noida", items: 5, total: 487, status: "pending", rider: null, eta: "—", placedAt: "2 min ago" },
  { id: "BK-10233", customer: "Neha Sharma", address: "Koramangala, Bangalore", items: 3, total: 215, status: "assigned", rider: "Priya K.", eta: "8 min", placedAt: "5 min ago" },
  { id: "BK-10232", customer: "Rohan Gupta", address: "Andheri West, Mumbai", items: 8, total: 1120, status: "picked", rider: "Amit D.", eta: "6 min", placedAt: "7 min ago" },
  { id: "BK-10231", customer: "Kavya Reddy", address: "HSR Layout, Bangalore", items: 2, total: 98, status: "out_for_delivery", rider: "Sneha M.", eta: "3 min", placedAt: "12 min ago" },
  { id: "BK-10230", customer: "Siddharth Jain", address: "Powai, Mumbai", items: 6, total: 765, status: "delivered", rider: "Vikram J.", eta: "—", placedAt: "18 min ago" },
  { id: "BK-10229", customer: "Meera Nair", address: "Indiranagar, Bangalore", items: 4, total: 340, status: "pending", rider: null, eta: "—", placedAt: "1 min ago" },
  { id: "BK-10228", customer: "Karan Patel", address: "Bandra East, Mumbai", items: 1, total: 58, status: "assigned", rider: "Rahul S.", eta: "10 min", placedAt: "9 min ago" },
  { id: "BK-10227", customer: "Divya Singh", address: "Connaught Place, Delhi", items: 7, total: 920, status: "out_for_delivery", rider: "Priya K.", eta: "2 min", placedAt: "14 min ago" },
];

import React, { createContext, useContext, useState, useCallback } from "react";
import { CartItem } from "./CartContext";

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  deliveryFee: number;
  grandTotal: number;
  address: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  paymentMethod: string;
  placedAt: number; // timestamp
  estimatedMinutes: number;
  status: "confirmed" | "preparing" | "out_for_delivery" | "delivered";
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "placedAt" | "estimatedMinutes" | "status">) => Order;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const placeOrder = useCallback(
    (orderData: Omit<Order, "id" | "placedAt" | "estimatedMinutes" | "status">) => {
      const estimatedMinutes = 20 + Math.floor(Math.random() * 25); // 20-44 mins
      const newOrder: Order = {
        ...orderData,
        id: `ORD-${Date.now().toString(36).toUpperCase()}`,
        placedAt: Date.now(),
        estimatedMinutes,
        status: "confirmed",
      };
      setOrders((prev) => [newOrder, ...prev]);

      // Simulate status progression
      setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) => (o.id === newOrder.id ? { ...o, status: "preparing" } : o))
        );
      }, 8000);
      setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) => (o.id === newOrder.id ? { ...o, status: "out_for_delivery" } : o))
        );
      }, 20000);
      setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) => (o.id === newOrder.id ? { ...o, status: "delivered" } : o))
        );
      }, estimatedMinutes * 60 * 1000);

      return newOrder;
    },
    []
  );

  return (
    <OrderContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};

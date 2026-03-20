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
  status: "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  cancelledAt?: number;
  cancelReason?: string;
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "placedAt" | "estimatedMinutes" | "status">) => Order;
  cancelOrder: (orderId: string, reason: string) => boolean;
  canCancelOrder: (order: Order) => boolean;
  getCancelTimeRemaining: (order: Order) => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const placeOrder = useCallback(
    (orderData: Omit<Order, "id" | "placedAt" | "estimatedMinutes" | "status">) => {
      const estimatedMinutes = 7 + Math.floor(Math.random() * 4); // 7-10 mins max
      const newOrder: Order = {
        ...orderData,
        id: `ORD-${Date.now().toString(36).toUpperCase()}`,
        placedAt: Date.now(),
        estimatedMinutes,
        status: "confirmed",
      };
      setOrders((prev) => [newOrder, ...prev]);

      // Simulate faster status progression for 10 min delivery
      const preparingDelay = 2 * 60 * 1000; // 2 min
      const outForDeliveryDelay = 5 * 60 * 1000; // 5 min
      const deliveredDelay = estimatedMinutes * 60 * 1000; // 7-10 min

      setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) => (o.id === newOrder.id && o.status !== "cancelled" ? { ...o, status: "preparing" } : o))
        );
      }, preparingDelay);
      setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) => (o.id === newOrder.id && o.status !== "cancelled" ? { ...o, status: "out_for_delivery" } : o))
        );
      }, outForDeliveryDelay);
      setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) => (o.id === newOrder.id && o.status !== "cancelled" ? { ...o, status: "delivered" } : o))
        );
      }, deliveredDelay);

      return newOrder;
    },
    []
  );

  // Can cancel if order is not delivered/cancelled AND at least 5 min remain before delivery
  const canCancelOrder = useCallback((order: Order): boolean => {
    if (order.status === "delivered" || order.status === "cancelled") return false;
    const deliveryTime = order.placedAt + order.estimatedMinutes * 60 * 1000;
    const fiveMinBeforeDelivery = deliveryTime - 5 * 60 * 1000;
    return Date.now() < fiveMinBeforeDelivery;
  }, []);

  // Returns seconds remaining to cancel (0 if can't cancel)
  const getCancelTimeRemaining = useCallback((order: Order): number => {
    if (order.status === "delivered" || order.status === "cancelled") return 0;
    const deliveryTime = order.placedAt + order.estimatedMinutes * 60 * 1000;
    const fiveMinBeforeDelivery = deliveryTime - 5 * 60 * 1000;
    const remaining = Math.max(0, Math.floor((fiveMinBeforeDelivery - Date.now()) / 1000));
    return remaining;
  }, []);

  const cancelOrder = useCallback((orderId: string, reason: string): boolean => {
    let success = false;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (o.status === "delivered" || o.status === "cancelled") return o;
        const deliveryTime = o.placedAt + o.estimatedMinutes * 60 * 1000;
        const fiveMinBeforeDelivery = deliveryTime - 5 * 60 * 1000;
        if (Date.now() >= fiveMinBeforeDelivery) return o;
        success = true;
        return { ...o, status: "cancelled" as const, cancelledAt: Date.now(), cancelReason: reason };
      })
    );
    return success;
  }, []);

  return (
    <OrderContext.Provider value={{ orders, placeOrder, cancelOrder, canCancelOrder, getCancelTimeRemaining }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};

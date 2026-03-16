import { useState } from "react";
import { Order, OrderStatus } from "@/types/dispatch";
import { mockOrders } from "@/data/mockDispatch";
import { statusConfig } from "@/components/dispatch/statusConfig";
import { toast } from "sonner";

export const useDispatch = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");

  const assignRider = (orderId: string, rider: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, rider, status: "assigned" as OrderStatus, eta: `${Math.floor(Math.random() * 8 + 4)} min` }
          : o
      )
    );
    toast.success(`${rider} assigned to ${orderId}`);
  };

  const advanceStatus = (orderId: string) => {
    const flow: OrderStatus[] = ["pending", "assigned", "picked", "out_for_delivery", "delivered"];
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const idx = flow.indexOf(o.status);
        if (idx < flow.length - 1) {
          const next = flow[idx + 1];
          toast.success(`${orderId} → ${statusConfig[next].label}`);
          return { ...o, status: next, eta: next === "delivered" ? "—" : o.eta };
        }
        return o;
      })
    );
  };

  const filtered = orders.filter((o) => statusFilter === "all" || o.status === statusFilter);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const activeCount = orders.filter((o) => ["assigned", "picked", "out_for_delivery"].includes(o.status)).length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  return {
    orders,
    filtered,
    statusFilter,
    setStatusFilter,
    assignRider,
    advanceStatus,
    pendingCount,
    activeCount,
    deliveredCount,
  };
};

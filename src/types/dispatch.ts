export type OrderStatus = "pending" | "assigned" | "picked" | "out_for_delivery" | "delivered";

export interface Order {
  id: string;
  customer: string;
  address: string;
  items: number;
  total: number;
  status: OrderStatus;
  rider: string | null;
  eta: string;
  placedAt: string;
}

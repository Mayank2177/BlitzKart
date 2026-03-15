import { Truck, User, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { OrderStatus } from "@/types/dispatch";

export const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-accent/10 text-accent border-accent/20", icon: <Circle className="h-3 w-3" /> },
  assigned: { label: "Assigned", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: <User className="h-3 w-3" /> },
  picked: { label: "Picked Up", color: "bg-purple-500/10 text-purple-600 border-purple-500/20", icon: <Loader2 className="h-3 w-3" /> },
  out_for_delivery: { label: "On the Way", color: "bg-primary/10 text-primary border-primary/20", icon: <Truck className="h-3 w-3" /> },
  delivered: { label: "Delivered", color: "bg-muted text-muted-foreground border-border", icon: <CheckCircle2 className="h-3 w-3" /> },
};

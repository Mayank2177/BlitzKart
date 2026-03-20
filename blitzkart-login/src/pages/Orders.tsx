import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useOrders, Order } from "@/contexts/OrderContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle2,
  ChefHat,
  Truck,
  ShoppingBag,
} from "lucide-react";

const statusConfig: Record<Order["status"], { label: string; icon: React.ElementType; color: string }> = {
  confirmed: { label: "Order Confirmed", icon: CheckCircle2, color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  preparing: { label: "Preparing", icon: ChefHat, color: "bg-amber-500/10 text-amber-600 border-amber-200" },
  out_for_delivery: { label: "Out for Delivery", icon: Truck, color: "bg-primary/10 text-primary border-primary/20" },
  delivered: { label: "Delivered", icon: Package, color: "bg-green-500/10 text-green-600 border-green-200" },
};

const statusSteps: Order["status"][] = ["confirmed", "preparing", "out_for_delivery", "delivered"];

function MinutesRemaining({ placedAt, estimatedMinutes, status }: { placedAt: number; estimatedMinutes: number; status: Order["status"] }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (status === "delivered") return;
    const interval = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(interval);
  }, [status]);

  if (status === "delivered") return <span className="text-green-600 font-semibold">Delivered ✓</span>;

  const elapsedMs = now - placedAt;
  const remainingMs = estimatedMinutes * 60 * 1000 - elapsedMs;
  const remainingMins = Math.max(1, Math.ceil(remainingMs / 60000));

  return (
    <span className="flex items-center gap-1.5 text-primary font-semibold">
      <Clock className="h-4 w-4" /> {remainingMins} min{remainingMins !== 1 ? "s" : ""} away
    </span>
  );
}

const OrderCard = ({ order }: { order: Order }) => {
  const config = statusConfig[order.status];
  const StatusIcon = config.icon;
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-heading font-bold text-foreground">{order.id}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.placedAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <MinutesRemaining placedAt={order.placedAt} estimatedMinutes={order.estimatedMinutes} status={order.status} />
            <Badge variant="outline" className={`gap-1.5 ${config.color}`}>
              <StatusIcon className="h-3.5 w-3.5" /> {config.label}
            </Badge>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-1">
          {statusSteps.map((step, i) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Separator />

        {/* Items */}
        <div className="flex flex-wrap gap-3">
          {order.items.map((item) => (
            <div key={item.name} className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
              <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" />
              <div>
                <p className="text-xs font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">×{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {order.items.reduce((s, i) => s + i.quantity, 0)} items · {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod === "upi" ? "UPI" : "Card"}
          </span>
          <span className="font-heading font-bold text-foreground">₹{order.grandTotal}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const Orders = () => {
  const { orders } = useOrders();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">No orders yet</h2>
            <p className="text-muted-foreground font-body max-w-md">
              Once you place an order, it will appear here with live delivery tracking.
            </p>
            <Link to="/">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;

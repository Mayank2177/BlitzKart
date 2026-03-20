import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useOrders, Order } from "@/contexts/OrderContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Clock,
  CheckCircle2,
  ChefHat,
  Truck,
  ShoppingBag,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const statusConfig: Record<Order["status"], { label: string; icon: React.ElementType; color: string }> = {
  confirmed: { label: "Order Confirmed", icon: CheckCircle2, color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  preparing: { label: "Preparing", icon: ChefHat, color: "bg-amber-500/10 text-amber-600 border-amber-200" },
  out_for_delivery: { label: "Out for Delivery", icon: Truck, color: "bg-primary/10 text-primary border-primary/20" },
  delivered: { label: "Delivered", icon: Package, color: "bg-green-500/10 text-green-600 border-green-200" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-destructive/10 text-destructive border-destructive/20" },
};

const statusSteps: Order["status"][] = ["confirmed", "preparing", "out_for_delivery", "delivered"];

function MinutesRemaining({ placedAt, estimatedMinutes, status }: { placedAt: number; estimatedMinutes: number; status: Order["status"] }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (status === "delivered" || status === "cancelled") return;
    const interval = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(interval);
  }, [status]);

  if (status === "delivered") return <span className="text-green-600 font-semibold">Delivered ✓</span>;
  if (status === "cancelled") return <span className="text-destructive font-semibold">Cancelled</span>;

  const elapsedMs = now - placedAt;
  const remainingMs = estimatedMinutes * 60 * 1000 - elapsedMs;
  const remainingMins = Math.max(1, Math.ceil(remainingMs / 60000));

  return (
    <span className="flex items-center gap-1.5 text-primary font-semibold">
      <Clock className="h-4 w-4" /> {remainingMins} min{remainingMins !== 1 ? "s" : ""} away
    </span>
  );
}

function CancelTimeRemaining({ order }: { order: Order }) {
  const { getCancelTimeRemaining } = useOrders();
  const [seconds, setSeconds] = useState(() => getCancelTimeRemaining(order));

  useEffect(() => {
    if (order.status === "delivered" || order.status === "cancelled") return;
    const interval = setInterval(() => {
      setSeconds(getCancelTimeRemaining(order));
    }, 1000);
    return () => clearInterval(interval);
  }, [order, getCancelTimeRemaining]);

  if (seconds <= 0) return null;

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <span className="text-xs text-muted-foreground flex items-center gap-1">
      <AlertTriangle className="h-3 w-3" />
      Cancel window: {mins}:{secs.toString().padStart(2, "0")}
    </span>
  );
}

const OrderCard = ({ order }: { order: Order }) => {
  const config = statusConfig[order.status];
  const StatusIcon = config.icon;
  const currentStep = order.status === "cancelled" ? -1 : statusSteps.indexOf(order.status);
  const { cancelOrder, canCancelOrder } = useOrders();
  const { toast } = useToast();
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [canCancel, setCanCancel] = useState(() => canCancelOrder(order));

  useEffect(() => {
    if (order.status === "delivered" || order.status === "cancelled") {
      setCanCancel(false);
      return;
    }
    const interval = setInterval(() => {
      setCanCancel(canCancelOrder(order));
    }, 1000);
    return () => clearInterval(interval);
  }, [order, canCancelOrder]);

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      toast({ variant: "destructive", title: "Please provide a reason for cancellation" });
      return;
    }
    const success = cancelOrder(order.id, cancelReason.trim());
    if (success) {
      toast({ title: "Order cancelled", description: "Your order has been cancelled. Refund will be processed shortly." });
      setShowCancelForm(false);
      setCancelReason("");
    } else {
      toast({ variant: "destructive", title: "Cannot cancel", description: "The cancellation window has closed." });
    }
  };

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
        {order.status !== "cancelled" && (
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
        )}

        {/* Cancelled reason */}
        {order.status === "cancelled" && order.cancelReason && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg px-4 py-3">
            <p className="text-sm text-destructive font-medium mb-1">Cancellation Reason:</p>
            <p className="text-sm text-muted-foreground">{order.cancelReason}</p>
            {order.cancelledAt && (
              <p className="text-xs text-muted-foreground mt-1">
                Cancelled at {new Date(order.cancelledAt).toLocaleString("en-IN", { timeStyle: "short", dateStyle: "medium" })}
              </p>
            )}
          </div>
        )}

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

        {/* Cancel section */}
        {canCancel && order.status !== "cancelled" && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <CancelTimeRemaining order={order} />
                {!showCancelForm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCancelForm(true)}
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive gap-1.5"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Cancel Order
                  </Button>
                )}
              </div>

              {showCancelForm && (
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Why are you cancelling this order?</p>
                  <Textarea
                    placeholder="Please provide a reason (e.g., ordered by mistake, found better price, delivery too slow...)"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleCancel}
                      disabled={!cancelReason.trim()}
                      className="gap-1.5"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Confirm Cancellation
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowCancelForm(false);
                        setCancelReason("");
                      }}
                    >
                      Keep Order
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
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

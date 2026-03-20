import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { getDeliveryFee, getDeliveryMessage, isNavratriActive } from "@/lib/delivery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  ChevronLeft,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacing, setIsPlacing] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
  });

  const deliveryFee = getDeliveryFee(totalPrice);
  const grandTotal = totalPrice + deliveryFee;
  const deliveryMsg = getDeliveryMessage(totalPrice);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = () => {
    if (!form.fullName || !form.phone || !form.pincode || !form.address || !form.city || !form.state) {
      toast({ title: "Missing fields", description: "Please fill all required address fields.", variant: "destructive" });
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast({ title: "Invalid phone", description: "Enter a valid 10-digit phone number.", variant: "destructive" });
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      toast({ title: "Invalid pincode", description: "Enter a valid 6-digit pincode.", variant: "destructive" });
      return;
    }

    setIsPlacing(true);
    setTimeout(() => {
      placeOrder({
        items: [...items],
        totalPrice,
        deliveryFee,
        grandTotal,
        address: form,
        paymentMethod,
      });
      clearCart();
      setIsPlacing(false);
      navigate("/orders");
      toast({ title: "Order placed! 🎉", description: "Track your order on the My Orders page." });
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
          <Package className="h-16 w-16 text-muted-foreground" />
          <h1 className="font-heading text-2xl font-bold text-foreground">No items to checkout</h1>
          <p className="text-muted-foreground font-body">Add some items to your cart first.</p>
          <Link to="/"><Button size="lg">Browse Products</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Cart
        </Link>

        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Address + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" /> Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" name="fullName" placeholder="John Doe" value={form.fullName} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" placeholder="9876543210" maxLength={10} value={form.phone} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea id="address" name="address" placeholder="House no., Street, Area" rows={3} value={form.address} onChange={handleChange} />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" placeholder="Mumbai" value={form.city} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" name="state" placeholder="Maharashtra" value={form.state} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input id="pincode" name="pincode" placeholder="400001" maxLength={6} value={form.pincode} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark (optional)</Label>
                  <Input id="landmark" name="landmark" placeholder="Near park, opposite mall…" value={form.landmark} onChange={handleChange} />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-primary" /> Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  {[
                    { value: "cod", icon: Banknote, label: "Cash on Delivery", desc: "Pay when your order arrives" },
                    { value: "upi", icon: Smartphone, label: "UPI", desc: "Google Pay, PhonePe, Paytm" },
                    { value: "card", icon: CreditCard, label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
                  ].map((m) => (
                    <label
                      key={m.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                        paymentMethod === m.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <RadioGroupItem value={m.value} />
                      <m.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-heading font-semibold text-foreground text-sm">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm font-body">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? "text-primary font-medium" : ""}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {deliveryMsg && (
                    <p className={`text-xs ${isNavratriActive() ? "text-orange-500 font-medium" : "text-muted-foreground"}`}>{deliveryMsg}</p>
                  )}
                  <Separator />
                  <div className="flex justify-between font-heading font-bold text-foreground text-base pt-1">
                    <span>Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isPlacing}>
                  {isPlacing ? "Placing Order…" : `Place Order • ₹${grandTotal}`}
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" /> Secure & encrypted checkout
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;

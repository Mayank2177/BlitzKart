import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDeliveryFee, getDeliveryMessage, isNavratriActive } from "@/lib/delivery";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Your cart is empty</h1>
          <p className="text-muted-foreground font-body max-w-md">
            Looks like you haven't added anything yet. Browse our products and add items to your cart.
          </p>
          <Link to="/">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Your Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h1>
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2">
            <Trash2 className="h-4 w-4" /> Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.name}
                className="bg-card rounded-xl border border-border p-4 flex items-center gap-4"
              >
                <div className="w-16 h-16 flex items-center justify-center bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-foreground truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground font-body">{item.unit}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-heading font-bold text-foreground">₹{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">₹{item.originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.name, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-heading font-bold text-foreground">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.name, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Item total + remove */}
                <div className="text-right flex-shrink-0">
                  <p className="font-heading font-bold text-foreground">₹{item.price * item.quantity}</p>
                  <button
                    onClick={() => removeItem(item.name)}
                    className="text-xs text-destructive hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24 space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">Order Summary</h2>
              {(() => {
                const deliveryFee = getDeliveryFee(totalPrice);
                const deliveryMsg = getDeliveryMessage(totalPrice);
                const grandTotal = totalPrice + deliveryFee;
                return (
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
                    <div className="border-t border-border pt-2 flex justify-between font-heading font-bold text-foreground text-base">
                      <span>Total</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>
                );
              })()}
              <Link to="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link to="/" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;

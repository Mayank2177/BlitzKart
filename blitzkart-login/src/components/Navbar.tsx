import { Search, ShoppingCart, MapPin, User, Package, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark">
      {/* Top bar */}
      <div className="border-b border-brand-charcoal">
        <div className="container mx-auto flex items-center justify-between px-4 py-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-primary-foreground/70">Deliver to <span className="font-medium text-primary-foreground">Mumbai, 400001</span></span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/inventory" className="text-primary-foreground/70 hover:text-primary transition-colors flex items-center gap-1">
              <Package className="h-4 w-4" /> Inventory
            </Link>
            <Link to="/dispatch" className="text-primary-foreground/70 hover:text-primary transition-colors flex items-center gap-1">
              <Truck className="h-4 w-4" /> Dispatch
            </Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="container mx-auto flex items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-lg">⚡</span>
          </div>
          <span className="font-heading text-xl font-bold text-primary-foreground">
            Blitz<span className="text-primary">Kart</span>
          </span>
        </Link>

        <div className="flex-1 max-w-2xl hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for groceries, fruits, snacks..."
              className="pl-10 h-10 bg-brand-charcoal border-brand-charcoal text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-brand-charcoal gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Login</span>
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-brand-charcoal gap-2 relative">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden md:inline">Cart</span>
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

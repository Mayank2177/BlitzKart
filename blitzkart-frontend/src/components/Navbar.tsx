import { Search, ShoppingCart, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-brand-dark border-b border-brand-charcoal">
      <div className="container flex items-center gap-4 h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-1 shrink-0">
          <span className="font-heading text-2xl font-bold text-primary">Blitz</span>
          <span className="font-heading text-2xl font-bold text-brand-lime">Kart</span>
          <span className="ml-1 text-xs font-body text-brand-lime animate-pulse-fast">⚡</span>
        </a>

        {/* Delivery location */}
        <button className="hidden md:flex items-center gap-1.5 text-sm shrink-0">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-primary-foreground font-medium">Deliver to</span>
          <span className="text-muted-foreground">Select location</span>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for groceries, snacks, drinks..."
            className="pl-9 bg-brand-charcoal border-none text-primary-foreground placeholder:text-muted-foreground h-10 rounded-lg"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary hover:bg-brand-charcoal">
            <User className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:text-primary hover:bg-brand-charcoal">
            <ShoppingCart className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground">
              3
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

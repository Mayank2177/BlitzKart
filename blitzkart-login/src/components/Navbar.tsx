import { useState } from "react";
import { Search, ShoppingCart, MapPin, User, Package, Truck, Sun, Moon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { allProducts } from "@/data/products";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-foreground/80 hover:text-foreground hover:bg-muted gap-2">
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};

const Navbar = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const results = query.trim().length > 0
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setShowResults(false);
    }
  };

  const handleSelect = (name: string) => {
    navigate(`/products?q=${encodeURIComponent(name)}`);
    setQuery("");
    setShowResults(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Deliver to <span className="font-medium text-foreground">Mumbai, 400001</span></span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/inventory" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Package className="h-4 w-4" /> Inventory
            </Link>
            <Link to="/dispatch" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
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
          <span className="font-heading text-xl font-bold text-foreground">
            Blitz<span className="text-primary">Kart</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden sm:block relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              placeholder="Search for groceries, snacks, electronics..."
              className="pl-10 h-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
              {results.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onMouseDown={() => handleSelect(p.name)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
                >
                  <img src={p.image} alt={p.name} className="w-8 h-8 object-contain rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category} · ₹{p.price}</p>
                  </div>
                </button>
              ))}
              <button
                type="button"
                onMouseDown={handleSearch}
                className="w-full px-4 py-2 text-sm text-primary font-medium hover:bg-accent transition-colors text-left border-t border-border"
              >
                See all results for "{query}"
              </button>
            </div>
          )}
        </form>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground hover:bg-muted gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Login</span>
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground hover:bg-muted gap-2 relative">
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

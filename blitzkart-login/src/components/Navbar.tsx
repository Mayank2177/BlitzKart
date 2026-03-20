import { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, MapPin, User, Package, Truck, Sun, Moon, LogOut, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { allProducts } from "@/data/products";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-foreground/80 hover:text-foreground hover:bg-muted gap-2">
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const initials = user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-primary">{initials}</span>
        </div>
        <span className="hidden md:block text-sm font-medium text-foreground max-w-[100px] truncate">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown className="h-3 w-3 text-muted-foreground hidden md:block" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="font-heading font-semibold text-foreground text-sm truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <span className="inline-flex mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
              {user.role === "admin" ? "Administrator" : "Customer"}
            </span>
          </div>

          <div className="p-1">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              My Profile
            </Link>
            <Link
              to="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Package className="h-4 w-4 text-muted-foreground" />
              My Orders
            </Link>
            {user.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Truck className="h-4 w-4 text-muted-foreground" />
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="p-1 border-t border-border">
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
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
          <Link to="/orders">
            <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground hover:bg-muted gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden md:inline">Orders</span>
            </Button>
          </Link>

          {isLoggedIn ? (
            <ProfileDropdown />
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground hover:bg-muted gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Login</span>
              </Button>
            </Link>
          )}

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

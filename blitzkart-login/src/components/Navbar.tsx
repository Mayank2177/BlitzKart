import { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, MapPin, User, Package, Truck, Sun, Moon, LogOut, ChevronDown, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { allProducts } from "@/data/products";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const PINCODE_DATA: Record<string, { area: string; city: string }> = {
  "700001": { area: "GPO, BBD Bagh", city: "Kolkata" },
  "700006": { area: "Howrah", city: "Kolkata" },
  "700064": { area: "Bidhannagar, Salt Lake", city: "Kolkata" },
  "700156": { area: "New Town", city: "Kolkata" },
  "700014": { area: "Sealdah", city: "Kolkata" },
  "700120": { area: "Barrackpore", city: "Kolkata" },
  "110001": { area: "Connaught Place", city: "Delhi" },
  "110017": { area: "Saket", city: "Delhi" },
  "600017": { area: "T. Nagar", city: "Chennai" },
  "600020": { area: "Adyar", city: "Chennai" },
  "560034": { area: "Koramangala", city: "Bangalore" },
  "560024": { area: "Hebbal", city: "Bangalore" },
  "400053": { area: "Andheri West", city: "Mumbai" },
  "411057": { area: "Hinjewadi", city: "Pune" },
  "440010": { area: "Dharampeth", city: "Nagpur" },
};

const LocationPicker = ({
  location,
  setLocation,
}: {
  location: { pincode: string; area: string; city: string };
  setLocation: (loc: { pincode: string; area: string; city: string }) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState("");

  const lookupPincode = (code: string) => {
    const data = PINCODE_DATA[code];
    if (data) {
      setLocation({ pincode: code, ...data });
      setOpen(false);
      setPincode("");
      setError("");
      toast.success(`Delivering to ${data.area}, ${data.city}`);
    } else {
      setError("We don't deliver to this pincode yet");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setError("Enter a valid 6-digit pincode");
      return;
    }
    lookupPincode(pincode);
  };

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      return;
    }
    setDetecting(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&addressdetails=1`
          );
          const data = await res.json();
          const detectedPincode = data.address?.postcode;
          if (detectedPincode && PINCODE_DATA[detectedPincode]) {
            lookupPincode(detectedPincode);
          } else if (detectedPincode) {
            setPincode(detectedPincode);
            setError("We don't deliver to this pincode yet. Try another.");
          } else {
            setError("Couldn't determine pincode. Please enter manually.");
          }
        } catch {
          setError("Failed to detect location. Please enter pincode manually.");
        } finally {
          setDetecting(false);
        }
      },
      () => {
        setError("Location access denied. Please enter pincode manually.");
        setDetecting(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 hover:bg-muted px-2 py-1 rounded-lg transition-colors">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground text-sm">
            Deliver to{" "}
            <span className="font-medium text-foreground">
              {location.area}, {location.pincode}
            </span>
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">Choose your location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleDetectLocation}
            disabled={detecting}
          >
            {detecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4 text-primary" />
            )}
            {detecting ? "Detecting location..." : "Use my current location"}
          </Button>

          <div className="relative flex items-center">
            <div className="flex-1 border-t border-border" />
            <span className="px-3 text-xs text-muted-foreground font-body">or enter pincode</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Enter 6-digit pincode"
              value={pincode}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                setPincode(v);
                setError("");
              }}
              maxLength={6}
              inputMode="numeric"
              className="flex-1"
            />
            <Button type="submit" disabled={pincode.length !== 6}>
              Check
            </Button>
          </form>

          {error && (
            <p className="text-sm text-destructive font-body">{error}</p>
          )}

          <div className="text-xs text-muted-foreground font-body">
            <p className="font-medium text-foreground mb-1">Available cities:</p>
            <p>Kolkata · Delhi · Chennai · Bangalore · Mumbai · Pune · Nagpur</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Navbar = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [location, setLocation] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bk-location");
      if (saved) return JSON.parse(saved);
    }
    return { pincode: "400053", area: "Andheri West", city: "Mumbai" };
  });

  const updateLocation = (loc: { pincode: string; area: string; city: string }) => {
    setLocation(loc);
    localStorage.setItem("bk-location", JSON.stringify(loc));
  };

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
          <LocationPicker location={location} setLocation={updateLocation} />
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

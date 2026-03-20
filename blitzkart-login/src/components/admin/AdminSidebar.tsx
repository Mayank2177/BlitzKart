import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Search,
  Boxes,
  Truck,
  MapPin,
  TrendingUp,
  Settings,
  Zap,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const AdminSidebarUser = () => {
  const { user } = useAuth();
  const displayName = user?.name || "Admin User";
  const initials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[hsl(var(--sidebar-accent))] cursor-pointer transition-colors">
        <div className="w-8 h-8 rounded-full bg-[hsl(var(--sidebar-primary))]/20 flex items-center justify-center text-xs font-bold text-[hsl(var(--sidebar-primary))]">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[hsl(var(--sidebar-accent-foreground))] truncate">{displayName}</p>
          <p className="text-[10px] text-[hsl(var(--sidebar-muted))]">{user?.role === "admin" ? "Super Admin" : "User"}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-[hsl(var(--sidebar-muted))]" />
      </div>
    </>
  );
};

const navSections = [
  {
    label: "OVERVIEW",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
      { icon: ClipboardList, label: "Orders", path: "/admin/orders", badge: 24 },
    ],
  },
  {
    label: "COMMERCE",
    items: [
      { icon: Package, label: "Products", path: "/admin/products" },
      { icon: Search, label: "Sellers", path: "/admin/sellers", badge: 3 },
      { icon: Boxes, label: "Inventory", path: "/admin/inventory" },
    ],
  },
  {
    label: "LOGISTICS",
    items: [
      { icon: Truck, label: "Delivery", path: "/admin/delivery" },
      { icon: MapPin, label: "Coverage Map", path: "/admin/coverage" },
      { icon: TrendingUp, label: "Analytics", path: "/admin/analytics" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { icon: Settings, label: "Settings", path: "/admin/settings" },
    ],
  },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[hsl(var(--sidebar-border))]">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[hsl(var(--sidebar-primary))] flex items-center justify-center">
            <Zap className="w-5 h-5 text-[hsl(var(--sidebar-primary-foreground))]" />
          </div>
          <div>
            <p className="font-heading text-sm font-bold text-[hsl(var(--sidebar-accent-foreground))]">
              BlitzKart
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[hsl(var(--sidebar-muted))]">
              Admin Console
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--sidebar-muted))]">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]"
                        : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
                    }`}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge
                        className={`h-5 min-w-[20px] flex items-center justify-center text-[10px] px-1.5 ${
                          isActive
                            ? "bg-[hsl(var(--sidebar-primary-foreground))]/20 text-[hsl(var(--sidebar-primary-foreground))]"
                            : "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-[hsl(var(--sidebar-border))]">
        <AdminSidebarUser />
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-sm text-[hsl(var(--sidebar-muted))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))] transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Exit Admin</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;

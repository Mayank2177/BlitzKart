import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Package,
  Truck,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "₹4,52,800", change: "+12.5%", icon: DollarSign, color: "text-primary" },
  { label: "Orders Today", value: "186", change: "+8.2%", icon: ShoppingCart, color: "text-blue-500" },
  { label: "Active Deliveries", value: "24", change: "-3.1%", icon: Truck, color: "text-amber-500" },
  { label: "New Customers", value: "42", change: "+18.7%", icon: Users, color: "text-purple-500" },
];

const recentOrders = [
  { id: "ORD-2847", customer: "Priya Sharma", items: 5, total: "₹1,240", status: "Preparing", time: "2 min ago" },
  { id: "ORD-2846", customer: "Amit Patel", items: 3, total: "₹680", status: "Out for Delivery", time: "8 min ago" },
  { id: "ORD-2845", customer: "Sneha Gupta", items: 8, total: "₹2,150", status: "Delivered", time: "15 min ago" },
  { id: "ORD-2844", customer: "Rahul Singh", items: 2, total: "₹340", status: "Confirmed", time: "22 min ago" },
  { id: "ORD-2843", customer: "Meera Joshi", items: 6, total: "₹1,890", status: "Preparing", time: "30 min ago" },
];

const statusColor: Record<string, string> = {
  Confirmed: "bg-blue-500/10 text-blue-600",
  Preparing: "bg-amber-500/10 text-amber-600",
  "Out for Delivery": "bg-primary/10 text-primary",
  Delivered: "bg-green-500/10 text-green-600",
};

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className={`h-3 w-3 ${stat.change.startsWith("+") ? "text-green-500" : "text-destructive"}`} />
                <span className={`text-xs font-medium ${stat.change.startsWith("+") ? "text-green-500" : "text-destructive"}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">vs yesterday</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" /> Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{order.id}</td>
                    <td className="py-3 px-4 text-foreground">{order.customer}</td>
                    <td className="py-3 px-4 text-muted-foreground">{order.items}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{order.total}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

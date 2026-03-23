import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users,
  Warehouse, ArrowUpRight, ArrowDownRight, BarChart3, PieChart as PieChartIcon,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { generateMockOrders, darkstores, getStockByDarkstore } from "@/data/mockDarkstores";

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(142 76% 36%)",
  "hsl(262 83% 58%)",
];

const AdminAnalytics = () => {
  const orders = useMemo(() => generateMockOrders(), []);
  const stockData = useMemo(() => getStockByDarkstore(), []);

  // KPIs
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount + o.deliveryFee, 0);
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
  const avgOrderValue = Math.round(totalRevenue / totalOrders);
  const deliveryRate = Math.round((deliveredOrders / totalOrders) * 100);

  // Revenue by day (last 7 days)
  const revenueByDay = useMemo(() => {
    const days: { day: string; revenue: number; orders: number }[] = [];
    const now = Date.now();
    for (let i = 6; i >= 0; i--) {
      const dayStart = now - i * 24 * 60 * 60 * 1000;
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const dayOrders = orders.filter((o) => o.placedAt >= dayStart && o.placedAt < dayEnd);
      const date = new Date(dayStart);
      days.push({
        day: date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
        revenue: dayOrders.reduce((s, o) => s + o.totalAmount, 0),
        orders: dayOrders.length,
      });
    }
    return days;
  }, [orders]);

  // Orders by status
  const ordersByStatus = useMemo(() => {
    const statusMap: Record<string, number> = {};
    orders.forEach((o) => {
      statusMap[o.status] = (statusMap[o.status] || 0) + 1;
    });
    return Object.entries(statusMap).map(([name, value]) => ({ name: name.replace(/_/g, " "), value }));
  }, [orders]);

  // Revenue by darkstore
  const revenueByDarkstore = useMemo(() => {
    return darkstores.map((ds) => {
      const dsOrders = orders.filter((o) => o.darkstoreId === ds.id);
      return {
        name: ds.area,
        city: ds.city,
        revenue: dsOrders.reduce((s, o) => s + o.totalAmount, 0),
        orders: dsOrders.length,
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  // Top products from orders
  const topProducts = useMemo(() => {
    const productMap: Record<string, { qty: number; revenue: number }> = {};
    orders.forEach((o) =>
      o.items.forEach((item) => {
        if (!productMap[item.name]) productMap[item.name] = { qty: 0, revenue: 0 };
        productMap[item.name].qty += item.qty;
        productMap[item.name].revenue += item.price * item.qty;
      })
    );
    return Object.entries(productMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [orders]);

  // City-wise order distribution
  const ordersByCity = useMemo(() => {
    const cityMap: Record<string, number> = {};
    orders.forEach((o) => {
      cityMap[o.city] = (cityMap[o.city] || 0) + 1;
    });
    return Object.entries(cityMap).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // Stock health
  const totalStock = stockData.reduce((s, ds) => s + ds.totalStock, 0);
  const totalLowStock = stockData.reduce((s, ds) => s + ds.lowStock, 0);

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "+12.5%", up: true, icon: DollarSign },
    { label: "Total Orders", value: totalOrders.toString(), change: "+8.2%", up: true, icon: ShoppingCart },
    { label: "Avg Order Value", value: `₹${avgOrderValue}`, change: "+5.1%", up: true, icon: TrendingUp },
    { label: "Delivery Rate", value: `${deliveryRate}%`, change: cancelledOrders > 5 ? "-2.3%" : "+1.8%", up: cancelledOrders <= 5, icon: Package },
    { label: "Active Darkstores", value: darkstores.length.toString(), change: "+2", up: true, icon: Warehouse },
    { label: "Low Stock Items", value: totalLowStock.toString(), change: totalLowStock > 10 ? `+${totalLowStock - 8}` : "-3", up: totalLowStock <= 10, icon: Package },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Business performance across all darkstores</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="font-heading text-xl font-bold text-foreground">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {stat.up ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive" />
                )}
                <span className={`text-xs font-medium ${stat.up ? "text-green-500" : "text-destructive"}`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Revenue Trend (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueByDay}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-primary" /> Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={ordersByStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {ordersByStatus.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {ordersByStatus.map((s, i) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="text-muted-foreground capitalize">{s.name}</span>
                  <span className="font-semibold text-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue by Darkstore */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Revenue by Darkstore
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByDarkstore.slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Top Products by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.qty} units sold</p>
                  </div>
                  <span className="text-sm font-bold text-foreground">₹{p.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* City Distribution + Orders per Day */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Orders by City
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ordersByCity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" /> Daily Order Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Line type="monotone" dataKey="orders" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--chart-3))" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Darkstore Performance Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Warehouse className="h-4 w-4 text-primary" /> Darkstore Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Darkstore</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">City</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Orders</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Stock Units</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Low Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Health</th>
                </tr>
              </thead>
              <tbody>
                {revenueByDarkstore.map((ds, i) => {
                  const stock = stockData.find((s) => s.area === ds.name);
                  return (
                    <tr key={ds.name} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{ds.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{ds.city}</td>
                      <td className="py-3 px-4 text-right font-medium">{ds.orders}</td>
                      <td className="py-3 px-4 text-right font-bold text-foreground">₹{ds.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{stock?.totalStock.toLocaleString() || "—"}</td>
                      <td className="py-3 px-4 text-right">{stock?.lowStock || 0}</td>
                      <td className="py-3 px-4">
                        {(stock?.lowStock || 0) === 0 ? (
                          <Badge variant="default" className="text-xs">Healthy</Badge>
                        ) : (stock?.lowStock || 0) < 5 ? (
                          <Badge variant="secondary" className="text-xs">Good</Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">Needs Attention</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;

import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowLeft, MapPin, Warehouse, Package, Truck, Users, AlertTriangle,
  CheckCircle2, Clock, TrendingUp, ShoppingCart, DollarSign, BarChart3,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { darkstores, getStockByDarkstore, generateMockOrders, darkstoreProducts } from "@/data/mockDarkstores";
import { categories } from "@/data/products";

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(142 76% 36%)",
  "hsl(262 83% 58%)",
];

interface CoverageZone {
  city: string;
  pincodes: string[];
  radius: string;
  population: string;
  status: "active" | "expanding" | "planned";
  avgDeliveryTime: string;
  deliveryPartners: number;
  serviceHours: string;
  launchDate: string;
}

const coverageZonesDetailed: CoverageZone[] = [
  { city: "Kolkata", pincodes: ["700001-700099", "711101-711110"], radius: "25 km", population: "14.8M", status: "active", avgDeliveryTime: "18 min", deliveryPartners: 120, serviceHours: "6 AM – 12 AM", launchDate: "Jan 2024" },
  { city: "Delhi", pincodes: ["110001-110099"], radius: "30 km", population: "19.0M", status: "active", avgDeliveryTime: "22 min", deliveryPartners: 85, serviceHours: "6 AM – 12 AM", launchDate: "Mar 2024" },
  { city: "Chennai", pincodes: ["600001-600099"], radius: "20 km", population: "10.9M", status: "active", avgDeliveryTime: "20 min", deliveryPartners: 65, serviceHours: "7 AM – 11 PM", launchDate: "Apr 2024" },
  { city: "Bangalore", pincodes: ["560001-560099"], radius: "22 km", population: "12.3M", status: "active", avgDeliveryTime: "19 min", deliveryPartners: 78, serviceHours: "6 AM – 12 AM", launchDate: "Feb 2024" },
  { city: "Mumbai", pincodes: ["400001-400099"], radius: "28 km", population: "20.7M", status: "active", avgDeliveryTime: "25 min", deliveryPartners: 95, serviceHours: "6 AM – 1 AM", launchDate: "Jan 2024" },
  { city: "Pune", pincodes: ["411001-411099"], radius: "18 km", population: "7.4M", status: "expanding", avgDeliveryTime: "15 min", deliveryPartners: 40, serviceHours: "7 AM – 11 PM", launchDate: "Sep 2024" },
  { city: "Nagpur", pincodes: ["440001-440035"], radius: "12 km", population: "2.9M", status: "expanding", avgDeliveryTime: "14 min", deliveryPartners: 25, serviceHours: "8 AM – 10 PM", launchDate: "Nov 2024" },
];

const AdminCoverageDetail = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const orders = useMemo(() => generateMockOrders(), []);
  const stockData = useMemo(() => getStockByDarkstore(), []);

  const decodedCity = decodeURIComponent(cityName || "");
  const cityDarkstores = darkstores.filter((ds) => ds.city === decodedCity);
  const cityOrders = useMemo(() => orders.filter((o) => o.city === decodedCity), [orders, decodedCity]);
  const cityStockData = useMemo(() => stockData.filter((s) => s.city === decodedCity), [stockData, decodedCity]);
  const zone = coverageZonesDetailed.find((z) => z.city === decodedCity);

  const totalRevenue = cityOrders.reduce((s, o) => s + o.totalAmount + o.deliveryFee, 0);
  const deliveredOrders = cityOrders.filter((o) => o.status === "delivered").length;
  const cancelledOrders = cityOrders.filter((o) => o.status === "cancelled").length;
  const totalStock = cityStockData.reduce((s, ds) => s + ds.totalStock, 0);
  const totalLowStock = cityStockData.reduce((s, ds) => s + ds.lowStock, 0);
  const avgOrderValue = cityOrders.length > 0 ? Math.round(totalRevenue / cityOrders.length) : 0;

  // Orders by status
  const ordersByStatus = useMemo(() => {
    const statusMap: Record<string, number> = {};
    cityOrders.forEach((o) => {
      const label = o.status.replace(/_/g, " ");
      statusMap[label] = (statusMap[label] || 0) + 1;
    });
    return Object.entries(statusMap).map(([name, value]) => ({ name, value }));
  }, [cityOrders]);

  // Revenue per darkstore in city
  const revenueByDarkstore = useMemo(() => {
    return cityDarkstores.map((ds) => {
      const dsOrders = cityOrders.filter((o) => o.darkstoreId === ds.id);
      return {
        name: ds.area,
        revenue: dsOrders.reduce((s, o) => s + o.totalAmount, 0),
        orders: dsOrders.length,
      };
    });
  }, [cityDarkstores, cityOrders]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const cityProducts = darkstoreProducts.filter((p) =>
      cityDarkstores.some((ds) => ds.id === p.darkstoreId)
    );
    return categories.map((cat) => {
      const catProducts = cityProducts.filter((p) => p.category === cat);
      return {
        category: cat,
        products: catProducts.length,
        stock: catProducts.reduce((s, p) => s + p.stock, 0),
        lowStock: catProducts.filter((p) => p.stock < 20).length,
      };
    }).filter((c) => c.products > 0);
  }, [cityDarkstores]);

  // Top selling products
  const topProducts = useMemo(() => {
    const productMap: Record<string, { qty: number; revenue: number }> = {};
    cityOrders.forEach((o) =>
      o.items.forEach((item) => {
        if (!productMap[item.name]) productMap[item.name] = { qty: 0, revenue: 0 };
        productMap[item.name].qty += item.qty;
        productMap[item.name].revenue += item.price * item.qty;
      })
    );
    return Object.entries(productMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [cityOrders]);

  if (!cityDarkstores.length) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">City not found</p>
        <Link to="/admin/coverage" className="text-primary hover:underline mt-2 inline-block">← Back to Coverage</Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/coverage" className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            {decodedCity} Coverage
          </h1>
          <p className="text-sm text-muted-foreground">
            {cityDarkstores.length} darkstores · {zone?.status === "active" ? "Fully Operational" : "Expanding"} · Since {zone?.launchDate || "—"}
          </p>
        </div>
        <Badge
          variant={zone?.status === "active" ? "default" : "secondary"}
          className="ml-auto text-xs"
        >
          {zone?.status === "active" ? (
            <><CheckCircle2 className="h-3 w-3 mr-1" /> Active</>
          ) : (
            <><Clock className="h-3 w-3 mr-1" /> Expanding</>
          )}
        </Badge>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        {[
          { label: "Darkstores", value: cityDarkstores.length, icon: Warehouse },
          { label: "Total Orders", value: cityOrders.length, icon: ShoppingCart },
          { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign },
          { label: "Avg Order", value: `₹${avgOrderValue}`, icon: TrendingUp },
          { label: "Delivered", value: deliveredOrders, icon: CheckCircle2 },
          { label: "Cancelled", value: cancelledOrders, icon: AlertTriangle },
          { label: "Stock Units", value: totalStock.toLocaleString(), icon: Package },
          { label: "Low Stock", value: totalLowStock, icon: AlertTriangle },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                <stat.icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="font-heading text-lg font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Details */}
      {zone && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" /> Service Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: "Delivery Radius", value: zone.radius },
                { label: "Avg Delivery Time", value: zone.avgDeliveryTime },
                { label: "Delivery Partners", value: zone.deliveryPartners.toString() },
                { label: "Service Hours", value: zone.serviceHours },
                { label: "Metro Population", value: zone.population },
                { label: "Pin Codes", value: zone.pincodes.join(", ") },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue by Darkstore */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Revenue by Darkstore
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueByDarkstore}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" /> Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={ordersByStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
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
            <div className="flex flex-wrap gap-2 justify-center">
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

      {/* Darkstores Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Warehouse className="h-4 w-4 text-primary" /> Darkstores in {decodedCity}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead className="text-right">Products</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Low Stock</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Health</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cityDarkstores.map((ds) => {
                  const stock = cityStockData.find((s) => s.id === ds.id);
                  const dsOrders = cityOrders.filter((o) => o.darkstoreId === ds.id);
                  const dsRevenue = dsOrders.reduce((s, o) => s + o.totalAmount, 0);
                  return (
                    <TableRow key={ds.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{ds.id}</TableCell>
                      <TableCell className="font-medium">{ds.name}</TableCell>
                      <TableCell className="text-muted-foreground">{ds.area}</TableCell>
                      <TableCell className="text-right">{stock?.totalProducts || 0}</TableCell>
                      <TableCell className="text-right font-medium">{stock?.totalStock.toLocaleString() || 0}</TableCell>
                      <TableCell className="text-right">
                        {(stock?.lowStock || 0) > 0 ? (
                          <span className="text-destructive font-semibold">{stock?.lowStock}</span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{dsOrders.length}</TableCell>
                      <TableCell className="text-right font-semibold">₹{dsRevenue.toLocaleString()}</TableCell>
                      <TableCell>
                        {(stock?.lowStock || 0) === 0 ? (
                          <Badge variant="default" className="text-xs">Healthy</Badge>
                        ) : (stock?.lowStock || 0) < 5 ? (
                          <Badge variant="secondary" className="text-xs">Good</Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">Attention</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Products</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Low Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryBreakdown.map((cb) => (
                    <TableRow key={cb.category}>
                      <TableCell className="font-medium">{cb.category}</TableCell>
                      <TableCell className="text-right">{cb.products}</TableCell>
                      <TableCell className="text-right">{cb.stock.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {cb.lowStock > 0 ? (
                          <span className="text-destructive font-semibold">{cb.lowStock}</span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Top Selling Products
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
              {topProducts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No order data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" /> Recent Orders in {decodedCity}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Darkstore</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cityOrders.slice(0, 15).map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell className="font-medium">{o.customerName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{o.darkstoreName}</TableCell>
                    <TableCell className="text-sm">{o.items.length} items</TableCell>
                    <TableCell className="text-right font-semibold">₹{(o.totalAmount + o.deliveryFee).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          o.status === "delivered" ? "default" :
                          o.status === "cancelled" ? "destructive" :
                          "secondary"
                        }
                        className="text-xs capitalize"
                      >
                        {o.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCoverageDetail;

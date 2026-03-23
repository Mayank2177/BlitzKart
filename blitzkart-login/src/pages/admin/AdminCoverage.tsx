import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPin, Warehouse, Package, Users, Truck, CheckCircle2, Clock, AlertTriangle, ChevronRight,
} from "lucide-react";
import { darkstores, getStockByDarkstore, generateMockOrders } from "@/data/mockDarkstores";

interface CoverageZone {
  city: string;
  pincodes: string[];
  radius: string;
  population: string;
  status: "active" | "expanding" | "planned";
}

const coverageZones: CoverageZone[] = [
  { city: "Kolkata", pincodes: ["700001-700099", "711101-711110"], radius: "25 km", population: "14.8M", status: "active" },
  { city: "Delhi", pincodes: ["110001-110099"], radius: "30 km", population: "19.0M", status: "active" },
  { city: "Chennai", pincodes: ["600001-600099"], radius: "20 km", population: "10.9M", status: "active" },
  { city: "Bangalore", pincodes: ["560001-560099"], radius: "22 km", population: "12.3M", status: "active" },
  { city: "Mumbai", pincodes: ["400001-400099"], radius: "28 km", population: "20.7M", status: "active" },
  { city: "Pune", pincodes: ["411001-411099"], radius: "18 km", population: "7.4M", status: "expanding" },
  { city: "Nagpur", pincodes: ["440001-440035"], radius: "12 km", population: "2.9M", status: "expanding" },
];

const cityColors: Record<string, string> = {
  Kolkata: "bg-blue-500",
  Delhi: "bg-red-500",
  Chennai: "bg-amber-500",
  Bangalore: "bg-purple-500",
  Mumbai: "bg-primary",
  Pune: "bg-green-500",
  Nagpur: "bg-orange-500",
};

const AdminCoverage = () => {
  const [selectedCity, setSelectedCity] = useState("all");
  const orders = useMemo(() => generateMockOrders(), []);
  const stockData = useMemo(() => getStockByDarkstore(), []);

  const cities = useMemo(() => [...new Set(darkstores.map((ds) => ds.city))], []);

  const filteredDarkstores = useMemo(() => {
    if (selectedCity === "all") return darkstores;
    return darkstores.filter((ds) => ds.city === selectedCity);
  }, [selectedCity]);

  const filteredZones = useMemo(() => {
    if (selectedCity === "all") return coverageZones;
    return coverageZones.filter((z) => z.city === selectedCity);
  }, [selectedCity]);

  // City stats
  const cityStats = useMemo(() => {
    return cities.map((city) => {
      const cityDarkstores = darkstores.filter((ds) => ds.city === city);
      const cityOrders = orders.filter((o) => o.city === city);
      const cityStock = stockData.filter((s) => s.city === city);
      const totalStock = cityStock.reduce((s, ds) => s + ds.totalStock, 0);
      const lowStock = cityStock.reduce((s, ds) => s + ds.lowStock, 0);
      const zone = coverageZones.find((z) => z.city === city);
      return {
        city,
        darkstoreCount: cityDarkstores.length,
        orderCount: cityOrders.length,
        totalStock,
        lowStock,
        revenue: cityOrders.reduce((s, o) => s + o.totalAmount, 0),
        status: zone?.status || "planned",
        radius: zone?.radius || "—",
        population: zone?.population || "—",
      };
    });
  }, [cities, orders, stockData]);

  const totalCities = cities.length;
  const totalDarkstoreCount = darkstores.length;
  const activeCities = coverageZones.filter((z) => z.status === "active").length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Coverage Map</h1>
        <p className="text-sm text-muted-foreground">Service areas, darkstore locations, and delivery zones</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Cities Covered</span>
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <p className="font-heading text-2xl font-bold text-foreground">{totalCities}</p>
            <p className="text-xs text-muted-foreground mt-1">{activeCities} fully active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Total Darkstores</span>
              <Warehouse className="h-4 w-4 text-primary" />
            </div>
            <p className="font-heading text-2xl font-bold text-foreground">{totalDarkstoreCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Across all cities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Total Orders</span>
              <Package className="h-4 w-4 text-primary" />
            </div>
            <p className="font-heading text-2xl font-bold text-foreground">{orders.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Last 72 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Avg Delivery Radius</span>
              <Truck className="h-4 w-4 text-primary" />
            </div>
            <p className="font-heading text-2xl font-bold text-foreground">22 km</p>
            <p className="text-xs text-muted-foreground mt-1">Per darkstore</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Visual Coverage Map */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Coverage Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cityStats
              .filter((cs) => selectedCity === "all" || cs.city === selectedCity)
              .map((cs) => (
                <Link
                  key={cs.city}
                  to={`/admin/coverage/${encodeURIComponent(cs.city)}`}
                  className="relative rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group block"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${cityColors[cs.city] || "bg-muted-foreground"}`} />
                    <h3 className="font-heading font-bold text-foreground">{cs.city}</h3>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-auto mr-1" />
                    <Badge
                      variant={cs.status === "active" ? "default" : "secondary"}
                      className="ml-auto text-[10px]"
                    >
                      {cs.status === "active" ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1" /> Active</>
                      ) : (
                        <><Clock className="h-3 w-3 mr-1" /> Expanding</>
                      )}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Darkstores</span>
                      <span className="font-semibold">{cs.darkstoreCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Orders</span>
                      <span className="font-semibold">{cs.orderCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-semibold">₹{cs.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Radius</span>
                      <span className="font-semibold">{cs.radius}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Population</span>
                      <span className="font-semibold">{cs.population}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stock</span>
                      <span className="font-semibold">{cs.totalStock.toLocaleString()} units</span>
                    </div>
                    {cs.lowStock > 0 && (
                      <div className="flex justify-between text-destructive">
                        <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Low Stock</span>
                        <span className="font-semibold">{cs.lowStock} items</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Darkstore Locations Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Warehouse className="h-4 w-4 text-primary" /> Darkstore Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Area</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">City</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Products</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDarkstores.map((ds) => {
                  const stock = stockData.find((s) => s.id === ds.id);
                  return (
                    <tr key={ds.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{ds.id}</td>
                      <td className="py-3 px-4 font-medium text-foreground">{ds.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{ds.area}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${cityColors[ds.city] || "bg-muted-foreground"}`} />
                          {ds.city}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">{stock?.totalProducts || 0}</td>
                      <td className="py-3 px-4 text-right font-medium">{stock?.totalStock.toLocaleString() || 0}</td>
                      <td className="py-3 px-4">
                        <Badge variant="default" className="text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Operational
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Coverage Zones */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Service Zones & Pin Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredZones.map((zone) => (
              <div key={zone.city} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-foreground flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${cityColors[zone.city] || "bg-muted-foreground"}`} />
                    {zone.city}
                  </h4>
                  <Badge
                    variant={zone.status === "active" ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {zone.status}
                  </Badge>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Pin Codes</span>
                    <span className="font-medium text-foreground">{zone.pincodes.join(", ")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery Radius</span>
                    <span className="font-medium text-foreground">{zone.radius}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Metro Population</span>
                    <span className="font-medium text-foreground">{zone.population}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCoverage;

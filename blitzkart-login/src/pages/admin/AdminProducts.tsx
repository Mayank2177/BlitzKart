import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, Warehouse, AlertTriangle, BarChart3, ChevronRight } from "lucide-react";
import { getStockByDarkstore, darkstoreProducts, darkstores } from "@/data/mockDarkstores";
import { categories } from "@/data/products";

const AdminProducts = () => {
  const stockData = useMemo(() => getStockByDarkstore(), []);
  const [selectedDarkstore, setSelectedDarkstore] = useState("all");

  const filteredProducts = useMemo(() => {
    if (selectedDarkstore === "all") return darkstoreProducts;
    return darkstoreProducts.filter((p) => p.darkstoreId === selectedDarkstore);
  }, [selectedDarkstore]);

  const totalStock = stockData.reduce((s, ds) => s + ds.totalStock, 0);
  const totalLowStock = stockData.reduce((s, ds) => s + ds.lowStock, 0);

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Products & Inventory</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-body">Total Darkstores</p>
            <p className="text-2xl font-heading font-bold text-foreground">{darkstores.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-body">Total Stock Units</p>
            <p className="text-2xl font-heading font-bold text-foreground">{totalStock.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-body">Product Categories</p>
            <p className="text-2xl font-heading font-bold text-foreground">{categories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-body">Low Stock Items</p>
            <p className="text-2xl font-heading font-bold text-destructive flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> {totalLowStock}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="darkstores">
        <TabsList>
          <TabsTrigger value="darkstores" className="gap-1"><Warehouse className="h-4 w-4" /> Per Darkstore</TabsTrigger>
          <TabsTrigger value="products" className="gap-1"><Package className="h-4 w-4" /> All Products</TabsTrigger>
        </TabsList>

        {/* Per Darkstore View */}
        <TabsContent value="darkstores" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stockData.map((ds) => (
              <Link key={ds.id} to={`/admin/products/${ds.id}`} className="block">
                <Card className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Warehouse className="h-4 w-4 text-primary" />
                        {ds.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{ds.area}, {ds.city} · {ds.id}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Products</span>
                      <span className="font-semibold">{ds.totalProducts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Stock</span>
                      <span className="font-semibold">{ds.totalStock.toLocaleString()} units</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Low Stock (&lt;20)</span>
                      <span className={`font-semibold ${ds.lowStock > 0 ? "text-destructive" : "text-green-600"}`}>
                        {ds.lowStock} items
                      </span>
                    </div>
                    <div className="pt-2 border-t border-border space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" /> Category Breakdown
                      </p>
                      {ds.categoryBreakdown.map((cb) => (
                        <div key={cb.category} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{cb.category}</span>
                          <span className="font-medium">{cb.count} products · {cb.stock} units</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* All Products View */}
        <TabsContent value="products" className="space-y-4 mt-4">
          <Select value={selectedDarkstore} onValueChange={setSelectedDarkstore}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="All Darkstores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Darkstores</SelectItem>
              {darkstores.map((ds) => (
                <SelectItem key={ds.id} value={ds.id}>{ds.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Darkstore</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.slice(0, 100).map((p, i) => (
                      <TableRow key={`${p.darkstoreId}-${p.productName}-${i}`}>
                        <TableCell className="font-medium text-sm">{p.productName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                        <TableCell className="text-sm">{p.darkstoreName}</TableCell>
                        <TableCell className="text-right">₹{p.price}</TableCell>
                        <TableCell className="text-right font-medium">{p.stock}</TableCell>
                        <TableCell>
                          {p.stock < 10 ? (
                            <Badge variant="destructive" className="text-xs">Critical</Badge>
                          ) : p.stock < 20 ? (
                            <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">Low</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">In Stock</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProducts;

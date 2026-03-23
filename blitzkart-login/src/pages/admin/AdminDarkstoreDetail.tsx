import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Warehouse, Package, AlertTriangle, Search } from "lucide-react";
import { darkstores, darkstoreProducts } from "@/data/mockDarkstores";
import { categories } from "@/data/products";
import { Input } from "@/components/ui/input";

const AdminDarkstoreDetail = () => {
  const { darkstoreId } = useParams<{ darkstoreId: string }>();
  const [filterCategory, setFilterCategory] = useState("all");
  const [search, setSearch] = useState("");

  const darkstore = darkstores.find((ds) => ds.id === darkstoreId);
  const products = useMemo(() => {
    return darkstoreProducts
      .filter((p) => p.darkstoreId === darkstoreId)
      .filter((p) => filterCategory === "all" || p.category === filterCategory)
      .filter((p) => !search || p.productName.toLowerCase().includes(search.toLowerCase()));
  }, [darkstoreId, filterCategory, search]);

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStock = products.filter((p) => p.stock < 20).length;
  const critical = products.filter((p) => p.stock < 10).length;

  if (!darkstore) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Darkstore not found</p>
        <Link to="/admin/products" className="text-primary hover:underline mt-2 inline-block">← Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/products" className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Warehouse className="h-6 w-6 text-primary" />
            {darkstore.name}
          </h1>
          <p className="text-sm text-muted-foreground">{darkstore.area}, {darkstore.city} · {darkstore.id}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-body">Total Products</p>
            <p className="text-2xl font-heading font-bold text-foreground">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-body">Total Stock</p>
            <p className="text-2xl font-heading font-bold text-foreground">{totalStock.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-body">Low Stock</p>
            <p className="text-2xl font-heading font-bold text-orange-500">{lowStock}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-body">Critical Stock</p>
            <p className="text-2xl font-heading font-bold text-destructive flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> {critical}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-[240px]"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p, i) => (
                  <TableRow key={`${p.productName}-${i}`}>
                    <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium text-sm flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {p.productName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{p.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">₹{p.price}</TableCell>
                    <TableCell className="text-right font-bold text-base">{p.stock}</TableCell>
                    <TableCell>
                      {p.stock < 10 ? (
                        <Badge variant="destructive" className="text-xs gap-1">
                          <AlertTriangle className="h-3 w-3" /> Critical
                        </Badge>
                      ) : p.stock < 20 ? (
                        <Badge variant="outline" className="text-xs border-orange-400 text-orange-500">Low Stock</Badge>
                      ) : p.stock < 50 ? (
                        <Badge variant="secondary" className="text-xs">Moderate</Badge>
                      ) : (
                        <Badge variant="default" className="text-xs">Well Stocked</Badge>
                      )}
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

export default AdminDarkstoreDetail;

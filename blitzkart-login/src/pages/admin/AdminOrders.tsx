import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, Package, TruckIcon, CheckCircle, XCircle, Clock, IndianRupee } from "lucide-react";
import { generateMockOrders, darkstores, MockAdminOrder } from "@/data/mockDarkstores";

const statusConfig: Record<MockAdminOrder["status"], { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  confirmed: { label: "Confirmed", variant: "outline", icon: <Clock className="h-3 w-3" /> },
  preparing: { label: "Preparing", variant: "secondary", icon: <Package className="h-3 w-3" /> },
  out_for_delivery: { label: "Out for Delivery", variant: "default", icon: <TruckIcon className="h-3 w-3" /> },
  delivered: { label: "Delivered", variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
  cancelled: { label: "Cancelled", variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
};

const AdminOrders = () => {
  const orders = useMemo(() => generateMockOrders(), []);
  const [filterDarkstore, setFilterDarkstore] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filterDarkstore !== "all" && o.darkstoreId !== filterDarkstore) return false;
      if (filterStatus !== "all" && o.status !== filterStatus) return false;
      return true;
    });
  }, [orders, filterDarkstore, filterStatus]);

  const totalRevenue = filtered.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.totalAmount + o.deliveryFee, 0);
  const deliveredCount = filtered.filter((o) => o.status === "delivered").length;
  const cancelledCount = filtered.filter((o) => o.status === "cancelled").length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">All Orders</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-body">Total Orders</p>
            <p className="text-2xl font-heading font-bold text-foreground">{filtered.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-body">Revenue</p>
            <p className="text-2xl font-heading font-bold text-foreground flex items-center"><IndianRupee className="h-5 w-5" />{totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-body">Delivered</p>
            <p className="text-2xl font-heading font-bold text-green-600">{deliveredCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-body">Cancelled</p>
            <p className="text-2xl font-heading font-bold text-destructive">{cancelledCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={filterDarkstore} onValueChange={setFilterDarkstore}>
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
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(statusConfig).map(([key, val]) => (
              <SelectItem key={key} value={key}>{val.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5 text-primary" />
            Orders ({filtered.length})
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
                  <TableHead>City</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => {
                  const cfg = statusConfig[order.status];
                  const timeAgo = Math.floor((Date.now() - order.placedAt) / (1000 * 60 * 60));
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{order.darkstoreName}</TableCell>
                      <TableCell className="text-sm">{order.city}</TableCell>
                      <TableCell className="text-sm">{order.items.length} items</TableCell>
                      <TableCell className="text-right font-medium">₹{(order.totalAmount + order.deliveryFee).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={cfg.variant} className="gap-1 text-xs">
                          {cfg.icon} {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {timeAgo < 1 ? "Just now" : `${timeAgo}h ago`}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;

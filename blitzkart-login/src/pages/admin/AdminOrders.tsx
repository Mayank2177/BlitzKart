import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

const AdminOrders = () => (
  <div className="p-6 space-y-6">
    <h1 className="font-heading text-2xl font-bold text-foreground">Orders</h1>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-primary" /> All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Order management interface — view, filter, and manage all customer orders.</p>
      </CardContent>
    </Card>
  </div>
);

export default AdminOrders;

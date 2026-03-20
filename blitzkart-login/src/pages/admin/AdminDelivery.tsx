import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

const AdminDelivery = () => (
  <div className="p-6 space-y-6">
    <h1 className="font-heading text-2xl font-bold text-foreground">Delivery</h1>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Delivery Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Track active deliveries, assign riders, and manage delivery zones.</p>
      </CardContent>
    </Card>
  </div>
);

export default AdminDelivery;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

const AdminSellers = () => (
  <div className="p-6 space-y-6">
    <h1 className="font-heading text-2xl font-bold text-foreground">Sellers</h1>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5 text-primary" /> Seller Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">View and manage seller accounts, approvals, and performance metrics.</p>
      </CardContent>
    </Card>
  </div>
);

export default AdminSellers;

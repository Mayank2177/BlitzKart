import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

const AdminProducts = () => (
  <div className="p-6 space-y-6">
    <h1 className="font-heading text-2xl font-bold text-foreground">Products</h1>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> Product Catalog</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Manage your product catalog — add, edit, and organize products across categories.</p>
      </CardContent>
    </Card>
  </div>
);

export default AdminProducts;

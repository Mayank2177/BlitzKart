import { Link } from "react-router-dom";
import { Package, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const InventoryHeader = () => (
  <div className="sticky top-0 z-50 bg-brand-dark text-primary-foreground">
    <div className="container mx-auto flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-brand-charcoal">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Package className="h-6 w-6 text-brand-lime" />
        <h1 className="font-heading text-xl font-bold">Inventory Management</h1>
      </div>
      <Badge className="bg-brand-lime text-brand-dark font-bold text-sm px-3 py-1">
        BlitzKart Admin
      </Badge>
    </div>
  </div>
);

export default InventoryHeader;

import { Link } from "react-router-dom";
import { Truck, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DispatchHeader = () => (
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-4">
      <Link to="/">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Truck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Dispatch Engine</h1>
          <Badge variant="secondary" className="text-xs">BlitzKart Admin</Badge>
        </div>
      </div>
    </div>
  </div>
);

export default DispatchHeader;

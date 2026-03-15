import { AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InventoryStatsProps {
  totalSKUs: number;
  totalItems: number;
  lowStockCount: number;
}

const InventoryStats = ({ totalSKUs, totalItems, lowStockCount }: InventoryStatsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground font-body">Total SKUs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-heading font-bold text-foreground">{totalSKUs}</p>
        </CardContent>
      </Card>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground font-body">Total Units</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-heading font-bold text-foreground">{totalItems.toLocaleString()}</p>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground font-body flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-destructive" /> Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-heading font-bold text-destructive">{lowStockCount}</p>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

export default InventoryStats;

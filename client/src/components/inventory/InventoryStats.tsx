import { AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InventoryStatsProps {
  totalSKUs: number;
  totalItems: number;
  lowStockCount: number;
}

const InventoryStats = ({ totalSKUs, totalItems, lowStockCount }: InventoryStatsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-body text-muted-foreground">Total SKUs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-heading font-bold">{totalSKUs}</p>
        </CardContent>
      </Card>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-body text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-4 w-4" /> Total Units
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-heading font-bold">{totalItems.toLocaleString()}</p>
        </CardContent>
      </Card>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-body text-muted-foreground flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-accent" /> Low Stock Alerts
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

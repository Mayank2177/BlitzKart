import { Clock, Truck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DispatchStatsProps {
  pendingCount: number;
  activeCount: number;
  deliveredCount: number;
}

const DispatchStats = ({ pendingCount, activeCount, deliveredCount }: DispatchStatsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground font-body flex items-center gap-1">
            <Clock className="h-4 w-4 text-accent" /> Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-heading font-bold text-accent">{pendingCount}</p>
        </CardContent>
      </Card>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground font-body flex items-center gap-1">
            <Truck className="h-4 w-4 text-primary" /> Active Deliveries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-heading font-bold text-primary">{activeCount}</p>
        </CardContent>
      </Card>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground font-body flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" /> Delivered Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-heading font-bold text-foreground">{deliveredCount}</p>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

export default DispatchStats;

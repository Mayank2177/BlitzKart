import { Clock, Truck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DispatchStatsProps {
  pendingCount: number;
  activeCount: number;
  deliveredCount: number;
}

const DispatchStats = ({ pendingCount, activeCount, deliveredCount }: DispatchStatsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-body text-muted-foreground flex items-center gap-1">
            <Clock className="h-4 w-4" /> Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-heading font-bold text-accent">{pendingCount}</p>
        </CardContent>
      </Card>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-body text-muted-foreground flex items-center gap-1">
            <Truck className="h-4 w-4" /> Active Deliveries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-heading font-bold text-primary">{activeCount}</p>
        </CardContent>
      </Card>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-body text-muted-foreground flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> Delivered Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-heading font-bold">{deliveredCount}</p>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

export default DispatchStats;

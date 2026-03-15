import { Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Order } from "@/types/dispatch";
import { riders } from "@/data/mockDispatch";
import { statusConfig } from "./statusConfig";

interface DispatchTableProps {
  orders: Order[];
  onAssignRider: (orderId: string, rider: string) => void;
  onAdvanceStatus: (orderId: string) => void;
}

const DispatchTable = ({ orders, onAssignRider, onAdvanceStatus }: DispatchTableProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-center">Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rider</TableHead>
            <TableHead>ETA</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => {
            const cfg = statusConfig[o.status];
            return (
              <TableRow key={o.id}>
                <TableCell className="font-mono font-bold text-sm">{o.id}</TableCell>
                <TableCell className="font-medium">{o.customer}</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[180px] truncate">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" />{o.address}</span>
                </TableCell>
                <TableCell className="text-center">{o.items}</TableCell>
                <TableCell className="text-right font-heading font-bold">₹{o.total}</TableCell>
                <TableCell>
                  <Badge className={`${cfg.color} text-xs gap-1`}>
                    {cfg.icon} {cfg.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {o.status === "pending" ? (
                    <Select onValueChange={(v) => onAssignRider(o.id, v)}>
                      <SelectTrigger className="h-8 w-[130px] text-xs">
                        <SelectValue placeholder="Assign rider" />
                      </SelectTrigger>
                      <SelectContent>
                        {riders.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-sm text-muted-foreground">{o.rider || "—"}</span>
                  )}
                </TableCell>
                <TableCell>
                  {o.eta !== "—" ? (
                    <span className="text-sm font-heading font-bold text-primary flex items-center gap-1">
                      <Clock className="h-3 w-3" />{o.eta}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {o.status !== "delivered" && o.status !== "pending" && (
                    <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => onAdvanceStatus(o.id)}>
                      Next ▸
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  </motion.div>
);

export default DispatchTable;

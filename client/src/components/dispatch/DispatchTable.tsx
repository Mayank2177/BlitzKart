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
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Rider</TableHead>
          <TableHead>ETA</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((o) => {
          const cfg = statusConfig[o.status];
          return (
            <motion.tr
              key={o.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b"
            >
              <TableCell className="font-mono text-sm font-bold">{o.id}</TableCell>
              <TableCell className="font-body">{o.customer}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{o.address}</span>
              </TableCell>
              <TableCell>{o.items}</TableCell>
              <TableCell className="font-bold">₹{o.total}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`${cfg.color} text-xs gap-1`}>
                  {cfg.icon} {cfg.label}
                </Badge>
              </TableCell>
              <TableCell>
                {o.status === "pending" ? (
                  <Select onValueChange={(v) => onAssignRider(o.id, v)}>
                    <SelectTrigger className="h-8 w-28 text-xs">
                      <SelectValue placeholder="Assign..." />
                    </SelectTrigger>
                    <SelectContent>
                      {riders.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm font-body">{o.rider || "—"}</span>
                )}
              </TableCell>
              <TableCell>
                {o.eta !== "—" ? (
                  <span className="flex items-center gap-1 text-sm text-primary font-medium">
                    <Clock className="h-3 w-3" />{o.eta}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {o.status !== "delivered" && o.status !== "pending" && (
                  <Button size="sm" variant="outline" onClick={() => onAdvanceStatus(o.id)}>
                    Next ▸
                  </Button>
                )}
              </TableCell>
            </motion.tr>
          );
        })}
      </TableBody>
    </Table>
  </Card>
);

export default DispatchTable;

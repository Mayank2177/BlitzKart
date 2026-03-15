import { TrendingDown, TrendingUp, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from "@/types/inventory";

interface InventoryTableProps {
  products: Product[];
  onAdjustStock: (id: string, delta: number) => void;
}

const InventoryTable = ({ products, onAdjustStock }: InventoryTableProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Min</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => {
            const isLow = p.stock < p.minStock;
            return (
              <TableRow key={p.id} className={isLow ? "bg-destructive/5" : ""}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">{p.sku}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">{p.category}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{p.warehouse}</TableCell>
                <TableCell className="text-right font-heading font-bold">{p.stock}</TableCell>
                <TableCell className="text-right text-muted-foreground">{p.minStock}</TableCell>
                <TableCell>
                  {isLow ? (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs gap-1">
                      <TrendingDown className="h-3 w-3" /> Low
                    </Badge>
                  ) : (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs gap-1">
                      <TrendingUp className="h-3 w-3" /> OK
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{p.lastUpdated}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onAdjustStock(p.id, -10)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onAdjustStock(p.id, 10)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  </motion.div>
);

export default InventoryTable;

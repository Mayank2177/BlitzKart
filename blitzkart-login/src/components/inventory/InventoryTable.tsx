import { Minus, Plus } from "lucide-react";
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
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Warehouse</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Min</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p) => {
          const isLow = p.stock < p.minStock;
          return (
            <motion.tr
              key={p.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b"
            >
              <TableCell className="font-medium font-body">{p.name}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{p.sku}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>{p.warehouse}</TableCell>
              <TableCell className={isLow ? "text-destructive font-bold" : ""}>{p.stock}</TableCell>
              <TableCell className="text-muted-foreground">{p.minStock}</TableCell>
              <TableCell>
                {isLow ? (
                  <Badge variant="destructive" className="text-xs">Low</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">OK</Badge>
                )}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{p.lastUpdated}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => onAdjustStock(p.id, -10)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => onAdjustStock(p.id, 10)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </motion.tr>
          );
        })}
      </TableBody>
    </Table>
  </Card>
);

export default InventoryTable;

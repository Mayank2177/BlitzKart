import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/types/dispatch";
import { statusConfig } from "./statusConfig";

interface DispatchFiltersProps {
  statusFilter: "all" | OrderStatus;
  setStatusFilter: (val: "all" | OrderStatus) => void;
}

const DispatchFilters = ({ statusFilter, setStatusFilter }: DispatchFiltersProps) => (
  <div className="flex gap-2 flex-wrap">
    {(["all", "pending", "assigned", "picked", "out_for_delivery", "delivered"] as const).map((s) => (
      <Button
        key={s}
        variant={statusFilter === s ? "default" : "outline"}
        size="sm"
        onClick={() => setStatusFilter(s)}
        className={statusFilter === s ? "bg-primary text-primary-foreground" : ""}
      >
        {s === "all" ? "All Orders" : statusConfig[s as OrderStatus].label}
      </Button>
    ))}
  </div>
);

export default DispatchFilters;

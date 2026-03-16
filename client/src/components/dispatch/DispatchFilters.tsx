import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/types/dispatch";
import { statusConfig } from "./statusConfig";

interface DispatchFiltersProps {
  statusFilter: "all" | OrderStatus;
  setStatusFilter: (val: "all" | OrderStatus) => void;
}

const DispatchFilters = ({ statusFilter, setStatusFilter }: DispatchFiltersProps) => (
  <div className="flex flex-wrap gap-2 mb-6">
    {(["all", "pending", "assigned", "picked", "out_for_delivery", "delivered"] as const).map((s) => (
      <Button
        key={s}
        variant="outline"
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

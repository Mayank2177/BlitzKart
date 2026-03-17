import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InventoryFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  filter: "all" | "low" | "ok";
  setFilter: (val: "all" | "low" | "ok") => void;
}

const InventoryFilters = ({ search, setSearch, filter, setFilter }: InventoryFiltersProps) => (
  <div className="flex flex-col sm:flex-row gap-4 mb-6">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by name or SKU..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10"
      />
    </div>
    <div className="flex gap-2">
      {(["all", "low", "ok"] as const).map((f) => (
        <Button
          key={f}
          variant="outline"
          size="sm"
          onClick={() => setFilter(f)}
          className={filter === f ? "bg-primary text-primary-foreground" : ""}
        >
          {f === "all" ? "All" : f === "low" ? "⚠ Low Stock" : "✓ In Stock"}
        </Button>
      ))}
    </div>
  </div>
);

export default InventoryFilters;

import { useInventory } from "@/hooks/useInventory";
import InventoryHeader from "@/components/inventory/InventoryHeader";
import InventoryStats from "@/components/inventory/InventoryStats";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import InventoryTable from "@/components/inventory/InventoryTable";

const Inventory = () => {
  const {
    products,
    filtered,
    search,
    setSearch,
    filter,
    setFilter,
    lowStockCount,
    totalItems,
    adjustStock,
  } = useInventory();

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <InventoryHeader />
        <InventoryStats totalSKUs={products.length} totalItems={totalItems} lowStockCount={lowStockCount} />
        <InventoryFilters search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} />
        <InventoryTable products={filtered} onAdjustStock={adjustStock} />
      </div>
    </div>
  );
};

export default Inventory;

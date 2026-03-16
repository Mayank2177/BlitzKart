import { useDispatch } from "@/hooks/useDispatch";
import DispatchHeader from "@/components/dispatch/DispatchHeader";
import DispatchStats from "@/components/dispatch/DispatchStats";
import DispatchFilters from "@/components/dispatch/DispatchFilters";
import DispatchTable from "@/components/dispatch/DispatchTable";

const Dispatch = () => {
  const {
    filtered,
    statusFilter,
    setStatusFilter,
    assignRider,
    advanceStatus,
    pendingCount,
    activeCount,
    deliveredCount,
  } = useDispatch();

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <DispatchHeader />
        <DispatchStats pendingCount={pendingCount} activeCount={activeCount} deliveredCount={deliveredCount} />
        <DispatchFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
        <DispatchTable orders={filtered} onAssignRider={assignRider} onAdvanceStatus={advanceStatus} />
      </div>
    </div>
  );
};

export default Dispatch;

import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
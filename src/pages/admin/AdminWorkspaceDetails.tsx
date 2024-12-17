import { useParams } from "react-router-dom";
import { WorkspaceMembersTable } from "@/components/admin/workspaces/WorkspaceMembersTable";

export default function AdminWorkspaceDetails() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Workspace ID is required</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Workspace Details</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Members</h2>
          <WorkspaceMembersTable workspaceId={id} />
        </div>
      </div>
    </div>
  );
}
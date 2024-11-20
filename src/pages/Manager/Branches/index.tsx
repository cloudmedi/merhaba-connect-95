import { ManagerLayout } from "@/components/layouts/ManagerLayout";
import { Button } from "@/components/ui/button";
import { GitBranch } from "lucide-react";

export default function Branches() {
  return (
    <ManagerLayout
      title="Branches"
      description="Manage your branches"
    >
      <div className="space-y-6">
        <Button className="gap-2">
          <GitBranch className="h-4 w-4" />
          Add Branch
        </Button>
        <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-500">
          Branches feature coming soon
        </div>
      </div>
    </ManagerLayout>
  );
}
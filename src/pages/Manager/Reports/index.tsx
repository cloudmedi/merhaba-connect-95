import { ManagerLayout } from "@/components/layouts/ManagerLayout";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

export default function Reports() {
  return (
    <ManagerLayout
      title="Reports"
      description="View system reports"
    >
      <div className="space-y-6">
        <div className="flex gap-4">
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
        <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-500">
          Reports feature coming soon
        </div>
      </div>
    </ManagerLayout>
  );
}
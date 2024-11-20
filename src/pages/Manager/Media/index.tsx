import { ManagerLayout } from "@/components/layouts/ManagerLayout";
import { Button } from "@/components/ui/button";
import { Upload, PlayCircle } from "lucide-react";

export default function Media() {
  return (
    <ManagerLayout
      title="Media Library"
      description="Manage your media files"
    >
      <div className="space-y-6">
        <div className="flex gap-4">
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Media
          </Button>
          <Button variant="outline" className="gap-2">
            <PlayCircle className="h-4 w-4" />
            Create Playlist
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-48 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
            Media Content Coming Soon
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
}
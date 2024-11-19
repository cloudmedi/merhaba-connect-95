import { Card, CardContent } from "@/components/ui/card";
import { Upload, PlaySquare, FolderPlus } from "lucide-react";

export function QuickActions() {
  return (
    <Card className="hover:shadow-lg transition-shadow bg-white border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="space-y-3">
          <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20 transition-colors">
            <Upload className="h-5 w-5" />
            <span className="text-sm font-medium">Upload Music</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
            <PlaySquare className="h-5 w-5" />
            <span className="text-sm font-medium">Create Playlist</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors">
            <FolderPlus className="h-5 w-5" />
            <span className="text-sm font-medium">Add Category</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
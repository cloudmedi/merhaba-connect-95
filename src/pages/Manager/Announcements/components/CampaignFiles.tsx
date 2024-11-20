import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampaignFile } from "../types";

interface CampaignFilesProps {
  files: CampaignFile[];
}

export function CampaignFiles({ files }: CampaignFilesProps) {
  return (
    <div className="p-4">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
          <Play className="w-4 h-4" />
          Campaign Files
          <span className="text-xs text-gray-400">{files.length} files</span>
        </h3>
      </div>
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium">{file.name}</div>
              <div className="text-xs text-gray-500">{file.size}</div>
              <div className="text-xs text-gray-500">{file.duration}</div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Play className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
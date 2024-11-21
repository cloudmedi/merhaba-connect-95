import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Music2 } from "lucide-react";
import { UploadMusicDialog } from "./components/UploadMusicDialog";

export function MusicHeader() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[#9b87f5]/10 rounded-xl">
          <Music2 className="h-8 w-8 text-[#9b87f5]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Music Library</h1>
          <p className="text-sm text-gray-500">Upload and manage your music collection</p>
        </div>
      </div>

      <Button
        onClick={() => setShowUploadDialog(true)}
        size="lg"
        className="bg-[#9b87f5] text-white hover:bg-[#8b77e5] px-6"
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload Music
      </Button>

      <UploadMusicDialog 
        open={showUploadDialog} 
        onOpenChange={setShowUploadDialog} 
      />
    </div>
  );
}
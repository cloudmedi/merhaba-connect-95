import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { UploadMusicDialog } from "./components/UploadMusicDialog";

export function MusicHeader() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  return (
    <div className="flex gap-4">
      <Button
        onClick={() => setShowUploadDialog(true)}
        className="bg-[#FFD700] text-black hover:bg-[#E6C200]"
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
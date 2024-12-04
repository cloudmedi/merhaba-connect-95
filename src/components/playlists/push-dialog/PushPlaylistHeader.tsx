import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PushPlaylistHeaderProps {
  onClose: () => void;
}

export function PushPlaylistHeader({ onClose }: PushPlaylistHeaderProps) {
  return (
    <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
      <DialogTitle className="text-xl font-semibold">Push Playlist</DialogTitle>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onClose}
        className="h-6 w-6 rounded-full hover:bg-gray-100"
      >
        <X className="h-4 w-4" />
      </Button>
    </DialogHeader>
  );
}
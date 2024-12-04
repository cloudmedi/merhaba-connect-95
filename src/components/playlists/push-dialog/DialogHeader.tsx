import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DialogHeaderProps {
  onClose: () => void;
}

export function DialogHeader({ onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <h2 className="text-lg font-semibold">Push Playlist</h2>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
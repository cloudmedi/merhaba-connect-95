import { DialogHeader as UIDialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogHeaderProps } from "./types";

export function DialogHeader({ onClose }: DialogHeaderProps) {
  return (
    <UIDialogHeader>
      <DialogTitle>Push Playlist</DialogTitle>
    </UIDialogHeader>
  );
}
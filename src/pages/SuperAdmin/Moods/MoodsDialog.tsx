import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mood } from "./types";

interface MoodsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingMood: Mood | null;
  newMoodName: string;
  setNewMoodName: (name: string) => void;
  newMoodDescription: string;
  setNewMoodDescription: (description: string) => void;
  newMoodIcon: string;
  setNewMoodIcon: (icon: string) => void;
  onSave: () => void;
}

export function MoodsDialog({
  isOpen,
  onOpenChange,
  editingMood,
  newMoodName,
  setNewMoodName,
  newMoodDescription,
  setNewMoodDescription,
  newMoodIcon,
  setNewMoodIcon,
  onSave,
}: MoodsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingMood ? "Edit Mood" : "Create New Mood"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Input
              id="icon"
              value={newMoodIcon}
              onChange={(e) => setNewMoodIcon(e.target.value)}
              placeholder="Enter mood icon"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newMoodName}
              onChange={(e) => setNewMoodName(e.target.value)}
              placeholder="Enter mood name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newMoodDescription}
              onChange={(e) => setNewMoodDescription(e.target.value)}
              placeholder="Enter mood description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onSave}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Mood } from "./types";

interface MoodsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mood: Mood | null;
  onSubmit: (mood: Partial<Mood>) => void;
}

const AVAILABLE_ICONS = [
  { value: "😊", label: "Happy" },
  { value: "😢", label: "Sad" },
  { value: "😌", label: "Relaxed" },
  { value: "😠", label: "Angry" },
  { value: "❤️", label: "Love" },
  { value: "💔", label: "Heartbreak" },
];

export function MoodsDialog({
  open,
  onOpenChange,
  mood,
  onSubmit,
}: MoodsDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: AVAILABLE_ICONS[0].value,
  });

  useEffect(() => {
    if (mood) {
      setFormData({
        name: mood.name,
        description: mood.description || "",
        icon: mood.icon || AVAILABLE_ICONS[0].value,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        icon: AVAILABLE_ICONS[0].value,
      });
    }
  }, [mood]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(mood ? { ...mood, ...formData } : formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mood ? "Edit Mood" : "Create New Mood"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select
              value={formData.icon}
              onValueChange={(value) => setFormData({ ...formData, icon: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ICONS.map((icon) => (
                  <SelectItem key={icon.value} value={icon.value}>
                    <span className="flex items-center gap-2">
                      {icon.value} {icon.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter mood name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter mood description"
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {mood ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
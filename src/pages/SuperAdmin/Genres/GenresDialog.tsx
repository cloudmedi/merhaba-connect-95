import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Genre } from "./types";

interface GenresDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  genre: Genre | null;
  onSubmit: (genre: any) => void;
}

export function GenresDialog({ open, onOpenChange, genre, onSubmit }: GenresDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (genre) {
      setFormData({
        name: genre.name,
        description: genre.description,
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [genre]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(genre ? { ...genre, ...formData } : formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{genre ? "Edit Genre" : "Create New Genre"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter genre name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter genre description"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {genre ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
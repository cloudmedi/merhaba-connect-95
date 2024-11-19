import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { MoodsHeader } from "./MoodsHeader";
import { MoodsTable } from "./MoodsTable";
import { MoodsDialog } from "./MoodsDialog";
import { Mood } from "./types";

const initialMoods: Mood[] = [
  { id: 1, name: "Happy", description: "Upbeat and cheerful", icon: "😊" },
  { id: 2, name: "Sad", description: "Melancholic and emotional", icon: "😢" },
  { id: 3, name: "Energetic", description: "Dynamic and lively", icon: "⚡" },
  { id: 4, name: "Relaxed", description: "Calm and peaceful", icon: "😌" },
];

export function MoodsContent() {
  const { toast } = useToast();
  const [moods, setMoods] = useState<Mood[]>(initialMoods);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMood, setEditingMood] = useState<Mood | null>(null);
  const [newMoodName, setNewMoodName] = useState("");
  const [newMoodDescription, setNewMoodDescription] = useState("");
  const [newMoodIcon, setNewMoodIcon] = useState("");

  const handleNewMood = () => {
    setEditingMood(null);
    setNewMoodName("");
    setNewMoodDescription("");
    setNewMoodIcon("");
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!newMoodName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a mood name",
        variant: "destructive",
      });
      return;
    }

    if (editingMood) {
      setMoods(
        moods.map((mood) =>
          mood.id === editingMood.id
            ? {
                ...mood,
                name: newMoodName,
                description: newMoodDescription,
                icon: newMoodIcon,
              }
            : mood
        )
      );
      toast({
        title: "Success",
        description: "Mood updated successfully",
      });
    } else {
      const newMood: Mood = {
        id: Math.max(...moods.map((m) => m.id), 0) + 1,
        name: newMoodName,
        description: newMoodDescription,
        icon: newMoodIcon,
      };
      setMoods([...moods, newMood]);
      toast({
        title: "Success",
        description: "New mood created successfully",
      });
    }

    setIsDialogOpen(false);
  };

  const handleEdit = (mood: Mood) => {
    setEditingMood(mood);
    setNewMoodName(mood.name);
    setNewMoodDescription(mood.description);
    setNewMoodIcon(mood.icon);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setMoods(moods.filter((mood) => mood.id !== id));
    toast({
      title: "Success",
      description: "Mood deleted successfully",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <MoodsHeader onNewMood={handleNewMood} />
      </div>

      <MoodsTable
        moods={moods}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <MoodsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingMood={editingMood}
        newMoodName={newMoodName}
        setNewMoodName={setNewMoodName}
        newMoodDescription={newMoodDescription}
        setNewMoodDescription={setNewMoodDescription}
        newMoodIcon={newMoodIcon}
        setNewMoodIcon={setNewMoodIcon}
        onSave={handleSave}
      />
    </div>
  );
}
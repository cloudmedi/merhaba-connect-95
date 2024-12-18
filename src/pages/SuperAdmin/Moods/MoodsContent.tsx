import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MoodsHeader } from "./MoodsHeader";
import { MoodsTable } from "./MoodsTable";
import { MoodsDialog } from "./MoodsDialog";
import { Mood } from "./types";
import { moodService } from "@/services/moods-service";

export function MoodsContent() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMood, setEditingMood] = useState<Mood | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMoods = async () => {
    try {
      const data = await moodService.getMoods();
      setMoods(data);
    } catch (error) {
      console.error('Error fetching moods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const handleCreate = async (newMood: Pick<Mood, "name" | "description" | "icon">) => {
    try {
      await moodService.createMood(newMood);
      setIsDialogOpen(false);
      fetchMoods();
      toast.success("Mood created successfully");
    } catch (error) {
      console.error('Error creating mood:', error);
    }
  };

  const handleEdit = async (updatedMood: Mood) => {
    try {
      const moodId = updatedMood._id || updatedMood.id;
      
      if (!moodId) {
        console.error('No valid ID found for mood:', updatedMood);
        toast.error("Invalid mood ID");
        return;
      }

      await moodService.updateMood(moodId, {
        name: updatedMood.name,
        description: updatedMood.description,
        icon: updatedMood.icon
      });
      
      setIsDialogOpen(false);
      setEditingMood(null);
      fetchMoods();
      toast.success("Mood updated successfully");
    } catch (error) {
      console.error('Error updating mood:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!id || id === 'undefined') {
        console.error('Invalid mood ID:', id);
        toast.error("Invalid mood ID");
        return;
      }
      
      await moodService.deleteMood(id);
      fetchMoods();
      toast.success("Mood deleted successfully");
    } catch (error) {
      console.error('Error deleting mood:', error);
    }
  };

  return (
    <div className="space-y-8">
      <MoodsHeader onNewMood={() => {
        setEditingMood(null);
        setIsDialogOpen(true);
      }} />
      
      <MoodsTable
        moods={moods}
        isLoading={isLoading}
        onEdit={(mood) => {
          setEditingMood(mood);
          setIsDialogOpen(true);
        }}
        onDelete={handleDelete}
      />
      
      <MoodsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mood={editingMood}
        onSubmit={editingMood ? handleEdit : handleCreate}
      />
    </div>
  );
}
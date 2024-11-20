import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { MoodsHeader } from "./MoodsHeader";
import { MoodsTable } from "./MoodsTable";
import { MoodsDialog } from "./MoodsDialog";
import { Mood } from "./types";
import { moodService } from "@/services/moods";

export function MoodsContent() {
  const { toast } = useToast();
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
      toast({
        title: "Success",
        description: "Mood created successfully",
      });
    } catch (error) {
      console.error('Error creating mood:', error);
    }
  };

  const handleEdit = async (updatedMood: Mood) => {
    try {
      const { id, name, description, icon } = updatedMood;
      await moodService.updateMood(id, { name, description, icon });
      setIsDialogOpen(false);
      setEditingMood(null);
      fetchMoods();
      toast({
        title: "Success",
        description: "Mood updated successfully",
      });
    } catch (error) {
      console.error('Error updating mood:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await moodService.deleteMood(id);
      fetchMoods();
      toast({
        title: "Success",
        description: "Mood deleted successfully",
      });
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
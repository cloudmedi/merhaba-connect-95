import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MoodsHeaderProps {
  onNewMood: () => void;
}

export function MoodsHeader({ onNewMood }: MoodsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Moods</h1>
      <Button onClick={onNewMood} className="bg-purple-600 hover:bg-purple-700">
        <Plus className="w-4 h-4 mr-2" />
        New Mood
      </Button>
    </div>
  );
}
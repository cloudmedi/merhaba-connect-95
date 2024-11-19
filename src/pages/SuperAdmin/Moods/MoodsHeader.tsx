import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MoodsHeaderProps {
  onNewMood: () => void;
}

export function MoodsHeader({ onNewMood }: MoodsHeaderProps) {
  return (
    <Button onClick={onNewMood} className="bg-[#FFD700] text-black hover:bg-[#E6C200]">
      <Plus className="w-4 h-4 mr-2" />
      New Mood
    </Button>
  );
}
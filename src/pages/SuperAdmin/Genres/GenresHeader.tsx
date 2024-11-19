import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface GenresHeaderProps {
  onCreateNew: () => void;
}

export function GenresHeader({ onCreateNew }: GenresHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <Button onClick={onCreateNew} className="bg-[#FFD700] text-black hover:bg-[#E6C200] ml-auto">
        <Plus className="w-4 h-4 mr-2" /> Add New Genre
      </Button>
    </div>
  );
}
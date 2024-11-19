import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface GenresHeaderProps {
  onCreateNew: () => void;
}

export function GenresHeader({ onCreateNew }: GenresHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Genres</h2>
        <p className="text-muted-foreground">
          Create and manage music genres
        </p>
      </div>
      <Button onClick={onCreateNew} className="bg-[#FFD700] text-black hover:bg-[#E6C200]">
        <Plus className="w-4 h-4 mr-2" /> Add New Genre
      </Button>
    </div>
  );
}
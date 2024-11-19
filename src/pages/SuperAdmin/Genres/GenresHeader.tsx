import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface GenresHeaderProps {
  onNewGenre: () => void;
}

export function GenresHeader({ onNewGenre }: GenresHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Genres</h1>
        <p className="text-sm text-gray-500 mt-1">Manage music genres for playlists</p>
      </div>
      <Button 
        onClick={onNewGenre}
        className="bg-purple-600 text-white hover:bg-purple-700"
      >
        <Plus className="w-4 h-4 mr-2" /> New Genre
      </Button>
    </div>
  );
}
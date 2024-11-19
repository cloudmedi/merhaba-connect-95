import { Button } from "@/components/ui/button";

interface PlaylistHeaderProps {
  onCancel: () => void;
  onCreate: () => void;
  isEditMode?: boolean;
}

export function PlaylistHeader({ onCancel, onCreate, isEditMode }: PlaylistHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">
        {isEditMode ? "Edit Playlist" : "Create New Playlist"}
      </h1>
      <div className="space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onCreate}>
          {isEditMode ? "Update Playlist" : "Create Playlist"}
        </Button>
      </div>
    </div>
  );
}
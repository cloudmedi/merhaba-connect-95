import { Button } from "@/components/ui/button";

interface PlaylistHeaderProps {
  onCancel: () => void;
  onCreate: () => void;
}

export function PlaylistHeader({ onCancel, onCreate }: PlaylistHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Create New Playlist</h1>
      <div className="space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onCreate}>
          Create Playlist
        </Button>
      </div>
    </div>
  );
}
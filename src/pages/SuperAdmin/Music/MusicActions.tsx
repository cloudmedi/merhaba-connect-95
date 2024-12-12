import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface MusicActionsProps {
  onRefresh: () => void;
}

export function MusicActions({ onRefresh }: MusicActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}
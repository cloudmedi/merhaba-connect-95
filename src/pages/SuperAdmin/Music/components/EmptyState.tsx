import { Music2 } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
      <Music2 className="w-12 h-12 mb-2" />
      <p>No songs uploaded yet</p>
      <p className="text-sm">Upload some music to get started</p>
    </div>
  );
}
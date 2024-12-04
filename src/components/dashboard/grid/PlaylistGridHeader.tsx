import { Button } from "@/components/ui/button";

interface PlaylistGridHeaderProps {
  title: string;
  description?: string;
  onViewAll?: () => void;
  categoryId?: string;
}

export function PlaylistGridHeader({ 
  title, 
  description, 
  onViewAll,
  categoryId 
}: PlaylistGridHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      {categoryId && (
        <Button 
          variant="ghost" 
          className="text-sm text-gray-500 hover:text-gray-900"
          onClick={onViewAll}
        >
          View All
        </Button>
      )}
    </div>
  );
}
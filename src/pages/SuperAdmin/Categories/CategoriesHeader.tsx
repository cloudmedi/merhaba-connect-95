import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CategoriesHeaderProps {
  onNewCategory: () => void;
}

export function CategoriesHeader({ onNewCategory }: CategoriesHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-500">Manage your music categories</p>
      </div>
      <Button onClick={onNewCategory}>
        <Plus className="w-4 h-4 mr-2" />
        New Category
      </Button>
    </div>
  );
}
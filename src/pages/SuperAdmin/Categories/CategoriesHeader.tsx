import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";

interface CategoriesHeaderProps {
  onCreateNew: () => void;
}

export function CategoriesHeader({ onCreateNew }: CategoriesHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <Button onClick={onCreateNew} className="bg-[#FFD700] text-black hover:bg-[#E6C200] ml-auto">
        <FolderPlus className="w-4 h-4 mr-2" /> Add New Category
      </Button>
    </div>
  );
}
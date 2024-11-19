import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CategoriesHeaderProps {
  onNewCategory: () => void;
}

export function CategoriesHeader({ onNewCategory }: CategoriesHeaderProps) {
  return (
    <Button onClick={onNewCategory} className="bg-[#FFD700] text-black hover:bg-[#E6C200]">
      <Plus className="w-4 h-4 mr-2" />
      New Category
    </Button>
  );
}
import { useState, useEffect } from "react";
import { CategoriesHeader } from "./CategoriesHeader";
import { CategoriesTable } from "./CategoriesTable";
import { CategoriesDialog } from "./CategoriesDialog";
import { Category } from "./types";
import { useToast } from "@/components/ui/use-toast";
import { categoryService } from "@/services/categories";

export function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (newCategory: Pick<Category, "name" | "description">) => {
    try {
      await categoryService.createCategory(newCategory);
      setIsDialogOpen(false);
      fetchCategories();
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleEdit = async (updatedCategory: Category) => {
    try {
      const { id, name, description } = updatedCategory;
      await categoryService.updateCategory(id, { name, description });
      setIsDialogOpen(false);
      setEditingCategory(null);
      fetchCategories();
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryService.deleteCategory(id);
      fetchCategories();
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleReorder = async (oldIndex: number, newIndex: number) => {
    try {
      const newCategories = [...categories];
      const [movedCategory] = newCategories.splice(oldIndex, 1);
      newCategories.splice(newIndex, 0, movedCategory);
      
      // Update positions in the database
      const updates = newCategories.map((category, index) => ({
        id: category.id,
        position: index + 1
      }));
      
      await categoryService.updatePositions(updates);
      setCategories(newCategories);
      
      toast({
        title: "Success",
        description: "Categories reordered successfully",
      });
    } catch (error) {
      console.error('Error reordering categories:', error);
      toast({
        title: "Error",
        description: "Failed to reorder categories",
        variant: "destructive",
      });
      // Refresh the list to ensure UI is in sync with database
      fetchCategories();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your music categories</p>
      </div>
      <CategoriesHeader 
        onCreateNew={() => {
          setEditingCategory(null);
          setIsDialogOpen(true);
        }}
      />
      <CategoriesTable 
        categories={categories}
        onEdit={(category) => {
          setEditingCategory(category);
          setIsDialogOpen(true);
        }}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />
      <CategoriesDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={editingCategory}
        onSubmit={editingCategory ? handleEdit : handleCreate}
      />
    </div>
  );
}
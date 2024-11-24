import { useState, useEffect } from "react";
import { CategoriesHeader } from "./CategoriesHeader";
import { CategoriesTable } from "./CategoriesTable";
import { CategoriesDialog } from "./CategoriesDialog";
import { Category } from "./types";
import { toast } from "sonner";
import { categoryService } from "@/services/categories";

export function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error("Failed to fetch categories");
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
      toast.success("Category created successfully");
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
      toast.success("Category updated successfully");
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryService.deleteCategory(id);
      fetchCategories();
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleReorder = async (oldIndex: number, newIndex: number) => {
    if (isReordering) return;
    
    try {
      setIsReordering(true);
      const newCategories = [...categories];
      const [movedCategory] = newCategories.splice(oldIndex, 1);
      newCategories.splice(newIndex, 0, movedCategory);
      
      // Update positions for all affected categories
      const updates = newCategories.map((category, index) => ({
        id: category.id,
        position: index + 1
      }));
      
      // Optimistically update the UI
      setCategories(newCategories);
      
      // Update in the database
      await categoryService.updatePositions(updates);
      toast.success("Categories reordered successfully");
    } catch (error) {
      console.error('Error reordering categories:', error);
      // Revert the optimistic update on error
      fetchCategories();
      toast.error("Failed to reorder categories");
    } finally {
      setIsReordering(false);
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
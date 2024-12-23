import { useState, useEffect } from "react";
import { CategoriesHeader } from "./CategoriesHeader";
import { CategoriesTable } from "./CategoriesTable";
import { CategoriesDialog } from "./CategoriesDialog";
import { Category } from "./types";
import { toast } from "sonner";
import { categoryService } from "@/services/categories-service";

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
      console.log("Creating new category with data:", newCategory);
      await categoryService.createCategory(newCategory);
      setIsDialogOpen(false);
      fetchCategories();
      toast.success("Category created successfully");
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error("Failed to create category");
    }
  };

  const handleEdit = async (updatedCategory: Category) => {
    try {
      console.log("Updating category with data:", updatedCategory);
      const categoryId = updatedCategory._id || updatedCategory.id;
      
      if (!categoryId) {
        console.error('No valid ID found for category:', updatedCategory);
        toast.error("Invalid category ID");
        return;
      }

      await categoryService.updateCategory({
        ...updatedCategory,
        id: categoryId
      });
      
      setIsDialogOpen(false);
      setEditingCategory(null);
      fetchCategories();
      toast.success("Category updated successfully");
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      console.log("Deleting category with ID:", categoryId);
      if (!categoryId) {
        toast.error("Invalid category ID");
        return;
      }
      await categoryService.deleteCategory(categoryId);
      fetchCategories();
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error("Failed to delete category");
    }
  };

  const handleReorder = async (oldIndex: number, newIndex: number) => {
    if (isReordering) return;
    
    try {
      setIsReordering(true);
      const newCategories = [...categories];
      const [movedCategory] = newCategories.splice(oldIndex, 1);
      newCategories.splice(newIndex, 0, movedCategory);
      
      const updates = newCategories.map((category, index) => ({
        id: category._id || category.id,
        position: index + 1
      }));
      
      setCategories(newCategories);
      await categoryService.updatePositions(updates);
      toast.success("Categories reordered successfully");
    } catch (error) {
      console.error('Error reordering categories:', error);
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
          console.log("Opening dialog for new category");
          setEditingCategory(null);
          setIsDialogOpen(true);
        }}
      />
      <CategoriesTable 
        categories={categories}
        onEdit={(category) => {
          console.log("Opening dialog to edit category:", category);
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
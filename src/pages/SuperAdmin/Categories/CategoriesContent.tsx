import { useState, useEffect } from "react";
import { CategoriesHeader } from "./CategoriesHeader";
import { CategoriesTable } from "./CategoriesTable";
import { CategoriesDialog } from "./CategoriesDialog";
import { Category } from "./types";
import { toast } from "sonner";
import { categoryService } from "@/services/categories";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      console.log('Fetched categories:', data);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();

    // Set up realtime subscription
    const channel = supabase
      .channel('categories_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        async (payload: RealtimePostgresChangesPayload<Category>) => {
          console.log('Realtime payload received:', payload);
          
          // Always fetch fresh data after any change
          await fetchCategories();

          // Show appropriate toast messages
          if (payload.eventType === 'UPDATE') {
            toast.success("Category updated successfully");
          } else if (payload.eventType === 'INSERT') {
            toast.success("New category added");
          } else if (payload.eventType === 'DELETE') {
            toast.success("Category deleted");
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to category changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to category changes');
          toast.error("Error subscribing to category updates");
        }
      });

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCreate = async (newCategory: Pick<Category, "name" | "description">) => {
    try {
      await categoryService.createCategory(newCategory);
      setIsDialogOpen(false);
      toast.success("Category created successfully");
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error("Failed to create category");
    }
  };

  const handleEdit = async (updatedCategory: Category) => {
    try {
      const { id, name, description } = updatedCategory;
      await categoryService.updateCategory(id, { name, description });
      setIsDialogOpen(false);
      setEditingCategory(null);
      toast.success("Category updated successfully");
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryService.deleteCategory(id);
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
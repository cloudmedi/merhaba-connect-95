import { useState } from "react";
import { CategoriesHeader } from "./CategoriesHeader";
import { CategoriesTable } from "./CategoriesTable";
import { CategoriesDialog } from "./CategoriesDialog";
import { Category } from "./types";

export const availableCategories: Category[] = [
  { id: 1, name: "Cozy Cafe", description: "Perfect for coffee shops and cafes" },
  { id: 2, name: "Shop Sound", description: "Retail and shopping environment" },
  { id: 3, name: "Restaurant Vibes", description: "Dining and restaurant atmosphere" },
  { id: 4, name: "Lounge Music", description: "Hotel lounges and bars" },
  { id: 5, name: "Spa Relaxation", description: "Wellness centers and spas" },
];

export function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>(availableCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  return (
    <div className="max-w-4xl mx-auto">
      <CategoriesHeader 
        onNewCategory={() => {
          setEditingCategory(null);
          setNewCategory({ name: "", description: "" });
          setIsDialogOpen(true);
        }}
      />
      
      <CategoriesTable 
        categories={categories}
        onEdit={(category) => {
          setEditingCategory(category);
          setNewCategory({ name: category.name, description: category.description });
          setIsDialogOpen(true);
        }}
        onDelete={(id) => {
          const updatedCategories = categories.filter((category) => category.id !== id);
          setCategories(updatedCategories);
          availableCategories.length = 0;
          availableCategories.push(...updatedCategories);
        }}
      />

      <CategoriesDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingCategory={editingCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        onSave={() => {
          if (editingCategory) {
            const updatedCategories = categories.map(category => 
              category.id === editingCategory.id 
                ? { ...category, ...newCategory }
                : category
            );
            setCategories(updatedCategories);
            availableCategories.length = 0;
            availableCategories.push(...updatedCategories);
          } else {
            const newCategoryWithId: Category = {
              id: Math.max(...categories.map(c => c.id), 0) + 1,
              ...newCategory
            };
            const updatedCategories = [...categories, newCategoryWithId];
            setCategories(updatedCategories);
            availableCategories.length = 0;
            availableCategories.push(...updatedCategories);
          }
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}
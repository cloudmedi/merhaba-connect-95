import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface CategoriesTabProps {
  selectedCategories: Category[];
  onSelectCategory: (category: Category) => void;
  onUnselectCategory: (categoryId: string) => void;
}

export function CategoriesTab({ selectedCategories, onSelectCategory, onUnselectCategory }: CategoriesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .ilike('name', `%${searchQuery}%`);
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(data || []);
    };

    fetchCategories();
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const isSelected = selectedCategories.some((c) => c.id === category.id);
          return (
            <div
              key={category.id}
              className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
              onClick={() => {
                if (isSelected) {
                  onUnselectCategory(category.id);
                } else {
                  onSelectCategory(category);
                }
              }}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => {
                  if (isSelected) {
                    onUnselectCategory(category.id);
                  } else {
                    onSelectCategory(category);
                  }
                }}
              />
              <div>
                <h4 className="text-sm font-medium">{category.name}</h4>
                {category.description && (
                  <p className="text-sm text-gray-500">{category.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedCategories.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Selected Categories:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                <span>{category.name}</span>
                <button
                  onClick={() => onUnselectCategory(category.id)}
                  className="hover:text-primary/80"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
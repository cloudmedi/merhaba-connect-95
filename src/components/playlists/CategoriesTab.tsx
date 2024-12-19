import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import axios from "@/lib/axios";
import ContentLoader from 'react-content-loader';

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

const CategoryCardLoader = () => (
  <ContentLoader
    speed={2}
    width={400}
    height={88}
    viewBox="0 0 400 88"
    backgroundColor="#f5f5f5"
    foregroundColor="#eeeeee"
  >
    <rect x="0" y="0" rx="8" ry="8" width="400" height="88" />
  </ContentLoader>
);

export function CategoriesTab({ selectedCategories, onSelectCategory, onUnselectCategory }: CategoriesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('/admin/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
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
        {isLoading ? (
          <>
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <CategoryCardLoader />
              </div>
            ))}
          </>
        ) : (
          categories.map((category) => {
            const isSelected = selectedCategories.some((c) => c.id === category.id);
            return (
              <div
                key={category.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  isSelected ? "bg-primary/10 border-primary" : "hover:bg-accent"
                }`}
                onClick={() => {
                  if (isSelected) {
                    onUnselectCategory(category.id);
                  } else {
                    onSelectCategory(category);
                  }
                }}
              >
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                {category.description && (
                  <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                )}
              </div>
            );
          })
        )}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnselectCategory(category.id);
                  }}
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
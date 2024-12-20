import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  showSelectAll?: boolean;
  onSelectAll?: () => void;
  selectAllText?: string;
}

export function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  showSelectAll, 
  onSelectAll,
  selectAllText 
}: SearchBarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      {showSelectAll && onSelectAll && (
        <Button 
          variant="outline" 
          onClick={onSelectAll}
          className="whitespace-nowrap"
        >
          {selectAllText}
        </Button>
      )}
    </div>
  );
}
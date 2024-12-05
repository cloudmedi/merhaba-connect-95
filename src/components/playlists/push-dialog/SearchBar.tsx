import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectAll: () => void;
  selectedCount: number;
  totalCount: number;
}

export function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  onSelectAll,
  selectedCount,
  totalCount 
}: SearchBarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Cihaz ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button 
        variant="outline" 
        onClick={onSelectAll}
        className="whitespace-nowrap"
      >
        {selectedCount === totalCount ? "Seçimi Kaldır" : "Tümünü Seç"}
      </Button>
    </div>
  );
}
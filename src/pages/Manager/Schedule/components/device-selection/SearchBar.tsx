import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="flex items-center justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Ara..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {showSelectAll && onSelectAll && (
        <Button 
          variant="link" 
          onClick={onSelectAll}
          className="ml-4"
        >
          {selectAllText}
        </Button>
      )}
    </div>
  );
}
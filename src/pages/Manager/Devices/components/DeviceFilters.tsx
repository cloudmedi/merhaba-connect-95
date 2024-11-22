import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, X } from "lucide-react";
import { useState, useEffect } from "react";

interface FilterConfig {
  searchTerm: string;
  status: string;
  type: string;
  location: string;
}

interface DeviceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  locationFilter: string;
  onLocationFilterChange: (value: string) => void;
}

export function DeviceFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  locationFilter,
  onLocationFilterChange,
}: DeviceFiltersProps) {
  const [savedFilters, setSavedFilters] = useState<{ name: string; config: FilterConfig }[]>([]);
  const [showSavedFilters, setShowSavedFilters] = useState(false);

  // Load saved filters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('deviceFilters');
    if (saved) {
      setSavedFilters(JSON.parse(saved));
    }
  }, []);

  const saveCurrentFilter = () => {
    const name = prompt('Enter a name for this filter combination:');
    if (!name) return;

    const newFilter = {
      name,
      config: {
        searchTerm,
        status: statusFilter,
        type: typeFilter,
        location: locationFilter
      }
    };

    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    localStorage.setItem('deviceFilters', JSON.stringify(updatedFilters));
  };

  const applyFilter = (filter: FilterConfig) => {
    onSearchChange(filter.searchTerm);
    onStatusFilterChange(filter.status);
    onTypeFilterChange(filter.type);
    onLocationFilterChange(filter.location);
  };

  const removeFilter = (index: number) => {
    const updatedFilters = savedFilters.filter((_, i) => i !== index);
    setSavedFilters(updatedFilters);
    localStorage.setItem('deviceFilters', JSON.stringify(updatedFilters));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="player">Player</SelectItem>
            <SelectItem value="display">Display</SelectItem>
            <SelectItem value="controller">Controller</SelectItem>
          </SelectContent>
        </Select>

        <Select value={locationFilter} onValueChange={onLocationFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="main">Main Branch</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
            <SelectItem value="office">Office</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={saveCurrentFilter}
          className="hover:bg-gray-100"
        >
          <Star className="h-4 w-4" />
        </Button>
      </div>

      {savedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {savedFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1 cursor-pointer hover:bg-gray-200"
              onClick={() => applyFilter(filter.config)}
            >
              {filter.name}
              <X
                className="ml-2 h-3 w-3 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilter(index);
                }}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
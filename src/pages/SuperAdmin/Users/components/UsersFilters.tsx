import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export function UsersFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="flex gap-4 items-center">
      <div className="relative w-[400px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          placeholder="Search users by name, email or company..." 
          className="pl-10"
          value={searchParams.get('search') || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
      </div>
      
      <Select 
        value={searchParams.get('role') || 'all'} 
        onValueChange={(value) => updateFilter('role', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="member">Member</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={searchParams.get('status') || 'all'}
        onValueChange={(value) => updateFilter('status', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="blocked">Blocked</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={searchParams.get('license') || 'all'}
        onValueChange={(value) => updateFilter('license', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Licenses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Licenses</SelectItem>
          <SelectItem value="trial">Trial</SelectItem>
          <SelectItem value="premium">Premium</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={searchParams.get('expiry') || 'all'}
        onValueChange={(value) => updateFilter('expiry', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Expiry Dates" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Expiry Dates</SelectItem>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="next-month">Next Month</SelectItem>
          <SelectItem value="expired">Expired</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
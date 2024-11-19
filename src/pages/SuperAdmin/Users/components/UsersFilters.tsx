import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";

export function UsersFilters() {
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [license, setLicense] = useState("all");
  const [expiry, setExpiry] = useState("all");

  return (
    <div className="flex gap-4 items-center">
      <div className="relative w-[400px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          placeholder="Search users by name, email or company..." 
          className="pl-10"
        />
      </div>
      
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="member">Member</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="blocked">Blocked</SelectItem>
        </SelectContent>
      </Select>

      <Select value={license} onValueChange={setLicense}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Licenses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Licenses</SelectItem>
          <SelectItem value="trial">Trial</SelectItem>
          <SelectItem value="premium">Premium</SelectItem>
        </SelectContent>
      </Select>

      <Select value={expiry} onValueChange={setExpiry}>
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
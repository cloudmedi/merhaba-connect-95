import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { Search } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface UsersTabProps {
  selectedUsers: User[];
  onSelectUser: (user: User) => void;
  onUnselectUser: (userId: number) => void;
}

// Mock data - Replace with actual API call
const mockUsers: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com" },
  { id: 4, name: "Sarah Wilson", email: "sarah@example.com" },
];

export function UsersTab({ selectedUsers, onSelectUser, onUnselectUser }: UsersTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSelected = (userId: number) => selectedUsers.some(u => u.id === userId);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <div className="bg-purple-100 text-purple-600 h-full w-full flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                )}
              </Avatar>
              <div>
                <h4 className="text-sm font-medium">{user.name}</h4>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <Checkbox
              checked={isSelected(user.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onSelectUser(user);
                } else {
                  onUnselectUser(user.id);
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
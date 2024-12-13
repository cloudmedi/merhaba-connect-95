import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/ManagerAuthContext";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

interface UsersTabProps {
  selectedUsers: User[];
  onSelectUser: (user: User) => void;
  onUnselectUser: (userId: string) => void;
}

export function UsersTab({ selectedUsers, onSelectUser, onUnselectUser }: UsersTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!user?.id) {
          console.log('No authenticated user found');
          setIsLoading(false);
          return;
        }

        // First get the current user's profile to get their company_id
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('company_id, role')
          .eq('id', user.id)
          .single();

        if (!userProfile?.company_id) {
          console.log('No company ID found for user');
          setIsLoading(false);
          return;
        }

        // Fetch all users from the same company
        let query = supabase
          .from('profiles')
          .select('id, email, first_name, last_name, role')
          .eq('company_id', userProfile.company_id);

        // Add search filter if there's a query
        if (searchQuery) {
          query = query.or(`email.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          setUsers(data);
        }

      } catch (error: any) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery, user?.id]);

  const isSelected = (userId: string) => selectedUsers.some(u => u.id === userId);

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

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="text-center p-4">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center p-4 text-gray-500">No users found</div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <div className="bg-purple-100 text-purple-600 h-full w-full flex items-center justify-center">
                    {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                  </div>
                </Avatar>
                <div>
                  <h4 className="text-sm font-medium">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : 'Unnamed User'}
                  </h4>
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
          ))
        )}
      </div>
    </div>
  );
}

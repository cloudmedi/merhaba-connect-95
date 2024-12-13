import { useState } from 'react';
import { UsersTable } from './components/UsersTable';
import { UsersFilters } from './components/UsersFilters';
import { UsersHeader } from './components/UsersHeader';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function Users() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          companies (
            id,
            name,
            subscription_status,
            subscription_ends_at
          ),
          licenses!left (
            type,
            start_date,
            end_date,
            quantity
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      console.log('Fetched users data:', data); // Debug log

      return data.map((profile): User => ({
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        role: profile.role as User['role'],
        isActive: profile.is_active,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        avatar_url: profile.avatar_url,
        companyId: profile.company_id,
        company: profile.companies,
        license: profile.licenses?.[0] // Get the first license if exists
      }));
    }
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
  };

  const handleDelete = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (error) throw error;
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleViewHistory = (user: User) => {
    setSelectedUser(user);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Users" 
      description="Manage system users and their permissions"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <UsersHeader />
        </div>
        <UsersFilters />
        <UsersTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewHistory={handleViewHistory}
        />
      </div>
    </DashboardLayout>
  );
}
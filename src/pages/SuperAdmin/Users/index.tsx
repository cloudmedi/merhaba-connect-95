import { useState } from 'react';
import { UsersTable } from './components/UsersTable';
import { UsersHeader } from './components/UsersHeader';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User, License } from '@/types/auth';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [licenseFilter, setLicenseFilter] = useState('all');

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', searchTerm, roleFilter, statusFilter, licenseFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          companies (
            id,
            name,
            subscription_status,
            subscription_ends_at
          ),
          licenses (
            type,
            start_date,
            end_date,
            quantity
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
      }

      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }

      if (statusFilter !== 'all') {
        query = query.eq('is_active', statusFilter === 'active');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
        throw error;
      }

      return data.map((profile): User => {
        const license = profile.licenses?.[0];
        const typedLicense: License | undefined = license ? {
          type: license.type === 'premium' ? 'premium' : 'trial',
          start_date: license.start_date,
          end_date: license.end_date,
          quantity: license.quantity
        } : undefined;

        return {
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
          license: typedLicense
        };
      });
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <UsersHeader 
          onSearch={setSearchTerm}
          onRoleFilter={setRoleFilter}
          onStatusFilter={setStatusFilter}
          onLicenseFilter={setLicenseFilter}
        />
        <UsersTable users={users || []} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserTableRow } from "./UserTableRow";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/auth";
import DataTableLoader from "@/components/loaders/DataTableLoader";

export function UsersTable() {
  const [searchParams] = useSearchParams();
  
  const filters = {
    search: searchParams.get('search') || undefined,
    role: searchParams.get('role') || undefined,
    status: searchParams.get('status') || undefined,
    license: searchParams.get('license') || undefined,
    expiry: searchParams.get('expiry') || undefined,
  };

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          company_id,
          is_active,
          created_at,
          updated_at,
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
        `);

      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters.role && filters.role !== 'all') {
        query = query.eq('role', filters.role);
      }

      if (filters.status && filters.status !== 'all') {
        query = query.eq('is_active', filters.status === 'active');
      }

      const { data, error } = await query;
      if (error) throw error;

      return data?.map((profile): User => ({
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        role: profile.role as 'super_admin' | 'manager' | 'admin',
        companyId: profile.company_id,
        isActive: profile.is_active,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        company: profile.companies ? {
          id: profile.companies.id,
          name: profile.companies.name,
          subscriptionStatus: profile.companies.subscription_status,
          subscriptionEndsAt: profile.companies.subscription_ends_at
        } : undefined,
        license: profile.licenses?.[0] ? {
          type: profile.licenses[0].type,
          start_date: profile.licenses[0].start_date,
          end_date: profile.licenses[0].end_date,
          quantity: profile.licenses[0].quantity
        } : undefined
      })) || [];
    },
    retry: 1
  });

  if (error) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-red-500">Error loading users: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return <DataTableLoader />;
  }

  if (!users?.length) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>COMPANY</TableHead>
            <TableHead>ROLE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>LICENSE</TableHead>
            <TableHead>EXPIRY</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow key={user.id} user={user} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
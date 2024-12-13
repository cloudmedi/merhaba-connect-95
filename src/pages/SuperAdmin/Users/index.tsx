import { Routes, Route } from "react-router-dom";
import { UsersTable } from "./components/UsersTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";

export default function Users() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          companies (
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

      if (error) throw error;

      // Map the response to match our User type with both snake_case and camelCase
      return data.map((profile: any): User => ({
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        role: profile.role,
        is_active: profile.is_active,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        avatar_url: profile.avatar_url,
        company_id: profile.company_id,
        
        // Add camelCase aliases
        firstName: profile.first_name,
        lastName: profile.last_name,
        isActive: profile.is_active,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        companyId: profile.company_id,
        
        company: profile.companies ? {
          id: profile.company_id,
          name: profile.companies.name,
          subscription_status: profile.companies.subscription_status,
          subscription_ends_at: profile.companies.subscription_ends_at,
          // Add camelCase aliases
          subscriptionStatus: profile.companies.subscription_status,
          subscriptionEndsAt: profile.companies.subscription_ends_at
        } : undefined,
        
        license: profile.licenses?.[0] ? {
          type: profile.licenses[0].type as 'trial' | 'premium',
          start_date: profile.licenses[0].start_date,
          end_date: profile.licenses[0].end_date,
          quantity: profile.licenses[0].quantity
        } : undefined
      }));
    }
  });

  return (
    <main className="p-8 bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">Manage system users</p>
        </div>

        <UsersTable users={users} isLoading={isLoading} />
      </div>
    </main>
  );
}
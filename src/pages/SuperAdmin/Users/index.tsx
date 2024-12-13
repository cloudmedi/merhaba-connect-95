import { Routes, Route } from "react-router-dom";
import { UsersTable } from "./components/UsersTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
            end_date
          )
        `);

      if (error) throw error;
      return data;
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
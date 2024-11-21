import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { CampaignRow } from "./CampaignRow";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Campaign } from "../types";

export function CampaignList() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          announcement_files (
            id,
            file_name,
            file_url,
            duration
          ),
          profiles (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match Campaign type
      return data.map((item): Campaign => ({
        ...item,
        status: item.status === 'pending' || item.status === 'playing' 
          ? item.status 
          : 'pending', // Default to pending if status is invalid
      }));
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns?.map((campaign) => (
            <CampaignRow key={campaign.id} campaign={campaign} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { CampaignRow } from "./CampaignRow";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Campaign } from "../types";

export function CampaignList() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data } = await api.get('/admin/announcements');
      
      // Transform the data to match Campaign type
      return data.map((item: any): Campaign => ({
        ...item,
        status: item.status === 'pending' || item.status === 'playing' 
          ? item.status 
          : 'pending', // Default to pending if status is invalid
        announcement_files: item.files || [],
        profiles: {
          first_name: item.created_by?.firstName || null,
          last_name: item.created_by?.lastName || null
        }
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
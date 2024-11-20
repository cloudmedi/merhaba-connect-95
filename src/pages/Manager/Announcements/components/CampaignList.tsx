import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { CampaignRow } from "./CampaignRow";
import { Campaign } from "../types";

const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Karpa Market Ekim Kampanyası",
    fileCount: 2,
    schedule: "2024-03-01",
    scheduleTime: "09:00",
    status: "pending",
    files: []
  },
  {
    id: 2,
    name: "Yılbaşı İndirimleri",
    fileCount: 1,
    status: "playing",
    files: [
      {
        id: 1,
        name: "YilbasiDuyuru.mp3",
        size: "4.00 MB",
        duration: "1:00"
      }
    ]
  }
];

export function CampaignList() {
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
          {mockCampaigns.map((campaign) => (
            <CampaignRow key={campaign.id} campaign={campaign} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
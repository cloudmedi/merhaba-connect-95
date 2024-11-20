import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CampaignList } from "./components/CampaignList";

export default function Announcements() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Campaigns</h1>
          <p className="text-sm text-gray-500">Manage your announcement campaigns</p>
        </div>
        <Button className="bg-[#6E59A5] hover:bg-[#7E69AB]">
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>
      <CampaignList />
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CampaignList } from "./components/CampaignList";
import { CreateCampaignDialog } from "./components/CreateCampaignDialog";
import { useState } from "react";

export default function Announcements() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Kampanyalar</h1>
          <p className="text-sm text-gray-500">Anons kampanyalarınızı yönetin</p>
        </div>
        <Button 
          className="bg-[#6E59A5] hover:bg-[#7E69AB]"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Kampanya Oluştur
        </Button>
      </div>

      <CampaignList />

      <CreateCampaignDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
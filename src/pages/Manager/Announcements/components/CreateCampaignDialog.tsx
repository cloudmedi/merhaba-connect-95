import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCampaignForm } from "./campaign-dialog/CampaignFormProvider";
import { useCampaignMutations } from "./campaign-dialog/useCampaignMutations";
import { CampaignDialogContent } from "./campaign-dialog/CampaignDialogContent";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const { formData, announcementId, setAnnouncementId, handleFormDataChange } = useCampaignForm();
  const { createAnnouncement, handleCreateCampaign } = useCampaignMutations();

  const handleFormDataChangeWithAnnouncement = async (data: Partial<typeof formData>) => {
    // If title is being changed, create or update the announcement
    if ('title' in data && data.title !== formData.title) {
      if (data.title && !announcementId) {
        const result = await createAnnouncement(data.title);
        if (result) {
          setAnnouncementId(result.id);
        }
      }
    }
    
    await handleFormDataChange(data);
  };

  const handleCreateSubmit = async () => {
    const success = await handleCreateCampaign(formData, announcementId);
    if (success) {
      onOpenChange(false);
      // Reset form
      handleFormDataChange({
        title: "",
        description: "",
        files: [],
        startDate: "",
        endDate: "",
        repeatType: "once",
        repeatInterval: 1,
        devices: []
      });
      setActiveTab("basic");
      setAnnouncementId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <CampaignDialogContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formData={formData}
          onFormDataChange={handleFormDataChangeWithAnnouncement}
          onSubmit={handleCreateSubmit}
          announcementId={announcementId}
        />
      </DialogContent>
    </Dialog>
  );
}
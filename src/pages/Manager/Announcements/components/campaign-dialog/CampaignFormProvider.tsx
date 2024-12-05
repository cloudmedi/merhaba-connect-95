import { useState } from "react";
import { CampaignFormData } from "../../types";

interface CampaignFormContextType {
  formData: CampaignFormData;
  announcementId: string | null;
  handleFormDataChange: (data: Partial<CampaignFormData>) => Promise<void>;
}

export const useCampaignForm = () => {
  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    description: "",
    files: [],
    startDate: "",
    endDate: "",
    repeatType: "once",
    repeatInterval: 1,
    devices: []
  });
  
  const [announcementId, setAnnouncementId] = useState<string | null>(null);

  const handleFormDataChange = async (data: Partial<CampaignFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return {
    formData,
    announcementId,
    setAnnouncementId,
    handleFormDataChange
  };
};
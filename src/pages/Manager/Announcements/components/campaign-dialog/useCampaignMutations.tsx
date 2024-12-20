import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import api from "@/lib/api";
import { CampaignFormData } from "../../types";

export const useCampaignMutations = () => {
  const { user } = useAuth();

  const createAnnouncement = async (title: string) => {
    if (!user) {
      toast.error("You must be logged in to create an announcement");
      return null;
    }

    try {
      const { data } = await api.post('/manager/announcements', {
        title,
        created_by: user.id,
        status: 'pending'
      });

      return data;
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      toast.error("Failed to create announcement");
      return null;
    }
  };

  const handleCreateCampaign = async (formData: CampaignFormData, announcementId: string | null) => {
    try {
      if (!announcementId) {
        toast.error("No announcement created. Please try again.");
        return false;
      }

      if (formData.devices.length === 0) {
        toast.error("Please select at least one device");
        return false;
      }

      // Update announcement with campaign details
      await api.put(`/manager/announcements/${announcementId}`, {
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
        repeat_type: formData.repeatType,
        repeat_interval: formData.repeatInterval,
        devices: formData.devices
      });

      toast.success("Campaign created successfully");
      return true;
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast.error(error.message || "Failed to create campaign");
      return false;
    }
  };

  return {
    createAnnouncement,
    handleCreateCampaign
  };
};
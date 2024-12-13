import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/ManagerAuthContext";

export function useCampaignMutations() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const createAnnouncement = async (title: string) => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .insert([{ 
          title,
          created_by: user?.id,
          company_id: user?.companyId
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error("Failed to create announcement");
      return null;
    }
  };

  const handleCreateCampaign = async (formData: any, announcementId: string | null) => {
    if (!announcementId) {
      toast.error("No announcement ID provided");
      return false;
    }

    setIsLoading(true);
    try {
      // Update announcement with campaign data
      const { error: updateError } = await supabase
        .from("announcements")
        .update({
          description: formData.description,
          start_date: formData.startDate,
          end_date: formData.endDate,
          repeat_type: formData.repeatType,
          repeat_interval: formData.repeatInterval,
          status: 'pending'
        })
        .eq('id', announcementId);

      if (updateError) throw updateError;

      // Create device assignments
      if (formData.devices.length > 0) {
        const { error: deviceError } = await supabase
          .from("announcement_branches")
          .insert(
            formData.devices.map((deviceId: string) => ({
              announcement_id: announcementId,
              branch_id: deviceId
            }))
          );

        if (deviceError) throw deviceError;
      }

      toast.success("Campaign created successfully");
      return true;
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createAnnouncement,
    handleCreateCampaign,
    isLoading
  };
}
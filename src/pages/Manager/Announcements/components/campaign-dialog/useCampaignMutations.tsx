import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/ManagerAuthContext";
import { toast } from "sonner";
import { CampaignFormData } from "../../types";

export const useCampaignMutations = () => {
  const { user } = useAuth();

  const createAnnouncement = async (title: string) => {
    if (!user) {
      toast.error("You must be logged in to create an announcement");
      return null;
    }

    const { data: announcement, error } = await supabase
      .from('announcements')
      .insert({
        title,
        created_by: user.id,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating announcement:', error);
      toast.error("Failed to create announcement");
      return null;
    }

    return announcement;
  };

  const handleCreateCampaign = async (formData: CampaignFormData, announcementId: string | null) => {
    try {
      if (!announcementId) {
        toast.error("No announcement created. Please try again.");
        return;
      }

      if (formData.devices.length === 0) {
        toast.error("Please select at least one device");
        return;
      }

      // Get unique branch IDs from selected devices
      const { data: deviceBranches } = await supabase
        .from('devices')
        .select('branch_id')
        .in('id', formData.devices)
        .not('branch_id', 'is', null);

      const branchIds = [...new Set(deviceBranches?.map(d => d.branch_id) || [])];

      // Update announcement with schedule details
      const { error: updateError } = await supabase
        .from('announcements')
        .update({
          description: formData.description,
          start_date: formData.startDate,
          end_date: formData.endDate,
          repeat_type: formData.repeatType,
          repeat_interval: formData.repeatInterval
        })
        .eq('id', announcementId);

      if (updateError) throw updateError;

      // Create announcement-branch associations
      if (branchIds.length > 0) {
        const { error: branchError } = await supabase
          .from('announcement_branches')
          .insert(
            branchIds.map(branchId => ({
              announcement_id: announcementId,
              branch_id: branchId
            }))
          );

        if (branchError) throw branchError;
      }

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

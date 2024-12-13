import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/ManagerAuthContext";

export function useCampaignMutations() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const createCampaign = async (campaignData) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .insert([{ ...campaignData, userId: user?.id }]);

      if (error) throw error;

      toast.success("Campaign created successfully!");
      return data;
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCampaign = async (campaignId, campaignData) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .update(campaignData)
        .eq("id", campaignId);

      if (error) throw error;

      toast.success("Campaign updated successfully!");
      return data;
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("Failed to update campaign.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCampaign = async (campaignId) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("campaigns")
        .delete()
        .eq("id", campaignId);

      if (error) throw error;

      toast.success("Campaign deleted successfully!");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete campaign.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCampaign,
    updateCampaign,
    deleteCampaign,
    isLoading,
  };
}

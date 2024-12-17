import { supabase } from "@/integrations/supabase/client";
import { User, UserUpdateInput } from "../../types";

export function useUserActions() {
  const handleStatusToggle = async (userId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId);

    if (error) throw error;
  };

  const handleLicenseRenewal = async (userId: string, data: { startDate: string; endDate: string }) => {
    const { error } = await supabase
      .from('licenses')
      .insert([{
        user_id: userId,
        start_date: data.startDate,
        end_date: data.endDate,
        type: 'premium'
      }]);

    if (error) throw error;
  };

  return {
    handleStatusToggle,
    handleLicenseRenewal
  };
}
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useUserActions() {
  const queryClient = useQueryClient();

  const handleRenewLicense = async (userId: string, data: { endDate: string }) => {
    try {
      await renewLicense(userId, data); // Added second argument
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("License renewed successfully");
    } catch (error) {
      console.error('Error renewing license:', error);
      toast.error("Failed to renew license");
    }
  };

  const updateUser = async (userId: string, data: UserUpdateInput) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', userId);

      if (error) throw error;

      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("Failed to update user");
    }
  };

  return {
    handleRenewLicense,
    updateUser
  };
}

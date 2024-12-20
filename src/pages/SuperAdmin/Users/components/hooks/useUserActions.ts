import { userService } from "@/services/users";
import { User } from "../../types";

export function useUserActions() {
  const handleStatusToggle = async (userId: string, isActive: boolean) => {
    try {
      await userService.updateUser(userId, { isActive });
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  };

  const handleLicenseRenewal = async (userId: string, data: { startDate: string; endDate: string }) => {
    try {
      await userService.renewLicense(userId, {
        type: 'premium',
        startDate: data.startDate,
        endDate: data.endDate,
        quantity: 1
      });
    } catch (error) {
      console.error('Error renewing license:', error);
      throw error;
    }
  };

  return {
    handleStatusToggle,
    handleLicenseRenewal
  };
}
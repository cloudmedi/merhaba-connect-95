import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

interface DeviceInfo {
  systemInfo?: Record<string, any>;
  existingDevice?: any;
}

export function useDeviceVerification() {
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyTokenAndGetDeviceInfo = async (token: string): Promise<DeviceInfo | null> => {
    try {
      setIsVerifying(true);
      console.log('Verifying token:', token);

      // Verify token and get device info from API
      const { data: deviceInfo } = await api.post('/manager/devices/verify-token', { token });

      if (!deviceInfo) {
        console.error('Token verification failed');
        toast.error('Token doğrulanamadı');
        return null;
      }

      console.log('Device info retrieved:', deviceInfo);

      // Check if token is expired
      if (deviceInfo.isExpired) {
        console.error('Token expired');
        toast.error('Token süresi dolmuş');
        return null;
      }

      // Check if token is already used
      if (deviceInfo.status === 'used') {
        console.error('Token already used');
        toast.error('Bu token zaten kullanılmış');
        return null;
      }

      return {
        systemInfo: deviceInfo.systemInfo || {},
        existingDevice: deviceInfo.existingDevice || null
      };
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Doğrulama sırasında bir hata oluştu');
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  const markTokenAsUsed = async (token: string) => {
    try {
      await api.post('/manager/devices/mark-token-used', { token });
    } catch (error) {
      console.error('Error marking token as used:', error);
      throw error;
    }
  };

  return {
    isVerifying,
    verifyTokenAndGetDeviceInfo,
    markTokenAsUsed
  };
}
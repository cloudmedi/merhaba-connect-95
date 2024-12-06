import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

interface DeviceInfo {
  systemInfo?: Record<string, any>;
  existingDevice?: any;
}

function isRecord(value: Json): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function useDeviceVerification() {
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyTokenAndGetDeviceInfo = async (token: string): Promise<DeviceInfo | null> => {
    try {
      setIsVerifying(true);
      console.log('Verifying token:', token);

      // First check if token exists and is active
      const { data: tokenData, error: tokenError } = await supabase
        .from('device_tokens')
        .select('*')
        .eq('token', token)
        .single();

      if (tokenError) {
        console.error('Token verification error:', tokenError);
        toast.error('Token doğrulanamadı');
        return null;
      }

      if (!tokenData) {
        console.error('Token not found');
        toast.error('Token bulunamadı');
        return null;
      }

      console.log('Found token:', tokenData);

      // Check if token is already used
      if (tokenData.status === 'used') {
        console.error('Token already used');
        toast.error('Bu token zaten kullanılmış');
        return null;
      }

      // Check if token is expired
      const isExpired = new Date(tokenData.expires_at) < new Date();
      if (isExpired) {
        console.error('Token expired');
        toast.error('Token süresi dolmuş');
        return null;
      }

      // Check if device already exists with this token
      const { data: existingDevice } = await supabase
        .from('devices')
        .select('*')
        .eq('token', token)
        .single();

      // Token durumunu güncelleme işlemini kaldırdık - bu artık cihaz oluşturulduktan sonra yapılacak

      // Ensure system_info is a valid object before returning
      const systemInfo = isRecord(tokenData.system_info) ? tokenData.system_info : {};

      return {
        systemInfo,
        existingDevice: existingDevice || null
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
      const { error: updateError } = await supabase
        .from('device_tokens')
        .update({ status: 'used' })
        .eq('token', token);

      if (updateError) {
        console.error('Error updating token status:', updateError);
        throw updateError;
      }
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
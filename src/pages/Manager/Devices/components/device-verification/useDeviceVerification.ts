import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDeviceVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyTokenAndGetDeviceInfo = async (token: string) => {
    try {
      setIsVerifying(true);

      // First verify the token
      const { data: tokenData, error: tokenError } = await supabase
        .from('device_tokens')
        .select('*, devices(*)')
        .eq('token', token)
        .eq('status', 'active')
        .single();

      if (tokenError || !tokenData) {
        toast.error('Geçersiz veya süresi dolmuş token');
        return null;
      }

      // Check if token is expired
      if (new Date(tokenData.expires_at) < new Date()) {
        toast.error('Token süresi dolmuş');
        return null;
      }

      // Get device info if exists
      const { data: existingDevice } = await supabase
        .from('devices')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      return {
        tokenData,
        existingDevice,
        systemInfo: tokenData.system_info || {}
      };

    } catch (error: any) {
      toast.error('Token doğrulama hatası: ' + error.message);
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    isVerifying,
    verifyTokenAndGetDeviceInfo
  };
};
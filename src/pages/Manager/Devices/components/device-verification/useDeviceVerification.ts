import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useDeviceVerification() {
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyTokenAndGetDeviceInfo = async (token: string) => {
    try {
      setIsVerifying(true);
      console.log('Verifying token:', token);

      // First check if token exists and is valid
      const { data: tokenData, error: tokenError } = await supabase
        .from('device_tokens')
        .select('*')
        .eq('token', token)
        .single();

      if (tokenError) {
        console.error('Token verification failed:', tokenError);
        toast.error('Geçersiz cihaz tokeni');
        return null;
      }

      if (!tokenData) {
        toast.error('Token bulunamadı');
        return null;
      }

      // Check if token is expired
      if (new Date(tokenData.expires_at) < new Date()) {
        toast.error('Token süresi dolmuş');
        return null;
      }

      // Return device info regardless of token status
      return {
        systemInfo: tokenData.system_info,
        existingDevice: null
      };

    } catch (error) {
      console.error('Error in verifyTokenAndGetDeviceInfo:', error);
      toast.error('Token doğrulama hatası');
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    isVerifying,
    verifyTokenAndGetDeviceInfo
  };
}
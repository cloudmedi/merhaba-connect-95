import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDeviceVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyTokenAndGetDeviceInfo = async (token: string) => {
    try {
      setIsVerifying(true);
      console.log('Verifying token:', token);

      // First verify the token
      const { data: tokenData, error: tokenError } = await supabase
        .from('device_tokens')
        .select('*')
        .eq('token', token)
        .eq('status', 'active')
        .single();

      console.log('Token verification result:', { tokenData, tokenError });

      if (tokenError) {
        console.error('Token verification error:', tokenError);
        toast.error('Token doğrulama hatası: ' + tokenError.message);
        return null;
      }

      if (!tokenData) {
        console.error('Token not found');
        toast.error('Token bulunamadı');
        return null;
      }

      // Check if token is expired
      if (new Date(tokenData.expires_at) < new Date()) {
        console.error('Token expired');
        toast.error('Token süresi dolmuş');
        return null;
      }

      // Get device info if exists
      const { data: existingDevice, error: deviceError } = await supabase
        .from('devices')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      if (deviceError) {
        console.error('Device fetch error:', deviceError);
      }

      console.log('Device info result:', { existingDevice, deviceError });

      return {
        tokenData,
        existingDevice,
        systemInfo: tokenData.system_info || {}
      };

    } catch (error: any) {
      console.error('Token verification process error:', error);
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
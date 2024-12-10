import { supabase } from '../../integrations/supabase/client';

export class TokenValidationManager {
  constructor(private deviceToken: string) {}

  async validateToken(): Promise<boolean> {
    try {
      console.log('Validating device token:', this.deviceToken);

      const { data: tokenData, error } = await supabase
        .from('device_tokens')
        .select('status, expires_at')
        .eq('token', this.deviceToken)
        .single();

      if (error) {
        console.error('Token validation error:', error);
        return false;
      }

      if (!tokenData) {
        console.error('Token not found');
        return false;
      }

      const isExpired = new Date(tokenData.expires_at) < new Date();
      const isValid = !isExpired && ['active', 'used'].includes(tokenData.status);

      console.log('Token validation result:', {
        isExpired,
        status: tokenData.status,
        isValid
      });

      return isValid;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
}
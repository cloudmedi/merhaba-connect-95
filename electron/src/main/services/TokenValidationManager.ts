import { createClient } from '@supabase/supabase-js';

export class TokenValidationManager {
  private supabase;

  constructor(private deviceToken: string) {
    // Supabase client'ı burada initialize ediyoruz
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async validateToken(): Promise<boolean> {
    try {
      console.log('Validating device token:', this.deviceToken);

      const { data: tokenData, error } = await this.supabase
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

      // Token süresi dolmuş mu kontrol et
      const isExpired = new Date(tokenData.expires_at) < new Date();
      
      // Token active VEYA used durumunda ve süresi dolmamışsa geçerli
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
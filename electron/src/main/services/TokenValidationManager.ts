import api from '../../lib/api';

export class TokenValidationManager {
  constructor(private deviceToken: string) {}

  async validateToken(): Promise<boolean> {
    try {
      console.log('Validating device token:', this.deviceToken);

      const response = await api.post('/manager/devices/verify', {
        token: this.deviceToken
      });

      const isValid = response.data?.valid || false;
      console.log('Token validation result:', isValid);

      return isValid;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
}
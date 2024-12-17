import { toast } from 'sonner';
import { AxiosError } from 'axios';

export function handleError(error: unknown) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || 'Bir hata oluştu';
    toast.error(message);
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }

  toast.error('Beklenmeyen bir hata oluştu');
}
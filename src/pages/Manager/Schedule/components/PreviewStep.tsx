import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Monitor } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface PreviewStepProps {
  formData: {
    title: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    devices: string[];
    notifications: { type: 'email' | 'system' | 'both'; timing: number; }[];
    recurrence?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number;
      endDate?: string;
    };
  };
  onBack: () => void;
  onCreate: () => void;
}

export function PreviewStep({ formData, onBack, onCreate }: PreviewStepProps) {
  const { data: devices = [] } = useQuery({
    queryKey: ['selected-devices', formData.devices],
    queryFn: async () => {
      if (formData.devices.length === 0) return [];
      
      const { data } = await api.get('/manager/devices', {
        params: {
          ids: formData.devices.join(',')
        }
      });
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full bg-[#9b87f5]"
          />
          <h3 className="text-lg font-semibold">{formData.title}</h3>
        </div>

        <div className="grid gap-4 text-sm">
          <div>
            <p className="text-gray-500">Zamanlama</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <p>
                  {new Date(formData.startDate).toLocaleDateString('tr-TR')} - {new Date(formData.endDate).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <p>
                  {formData.startTime} - {formData.endTime}
                </p>
              </div>
            </div>
          </div>

          {formData.recurrence && (
            <div>
              <p className="text-gray-500">Tekrar</p>
              <p>
                Her {formData.recurrence.interval}{" "}
                {formData.recurrence.frequency === 'daily' ? 'gün' : 
                 formData.recurrence.frequency === 'weekly' ? 'hafta' : 'ay'}
                {formData.recurrence.endDate &&
                  ` (${new Date(formData.recurrence.endDate).toLocaleDateString('tr-TR')} tarihine kadar)`}
              </p>
            </div>
          )}

          <div>
            <p className="text-gray-500">Bildirimler</p>
            <ul className="list-disc list-inside">
              {formData.notifications.map((notification, index) => (
                <li key={index}>
                  {notification.type === 'email' ? 'E-posta' : 
                   notification.type === 'system' ? 'Sistem' : 'E-posta ve Sistem'} 
                  - {notification.timing} dakika önce
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-gray-500">Seçili Cihazlar</p>
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-gray-500" />
              <p>{devices.length} cihaz seçildi</p>
            </div>
            <div className="mt-2 space-y-1">
              {devices.map((device: any) => (
                <p key={device.id} className="text-sm text-gray-600 ml-6">
                  • {device.name}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Geri
        </Button>
        <Button 
          onClick={onCreate} 
          className="bg-[#6E59A5] hover:bg-[#5a478a] text-white"
        >
          Etkinlik Oluştur
        </Button>
      </div>
    </div>
  );
}
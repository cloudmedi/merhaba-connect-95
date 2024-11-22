import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    deviceAlerts: true,
    updateNotifications: true,
  });

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: !prev[key] };
      toast.success("Bildirim ayarları güncellendi");
      return newSettings;
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>E-posta Bildirimleri</Label>
            <p className="text-sm text-gray-500">
              Önemli güncellemeler ve bildirimler için e-posta alın
            </p>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={() => handleSettingChange('emailNotifications')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Push Bildirimleri</Label>
            <p className="text-sm text-gray-500">
              Tarayıcı üzerinden anlık bildirimler alın
            </p>
          </div>
          <Switch
            checked={settings.pushNotifications}
            onCheckedChange={() => handleSettingChange('pushNotifications')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Cihaz Uyarıları</Label>
            <p className="text-sm text-gray-500">
              Cihazlarınızla ilgili önemli durumlar hakkında bildirim alın
            </p>
          </div>
          <Switch
            checked={settings.deviceAlerts}
            onCheckedChange={() => handleSettingChange('deviceAlerts')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Sistem Güncellemeleri</Label>
            <p className="text-sm text-gray-500">
              Platform güncellemeleri ve yeni özellikler hakkında bilgi alın
            </p>
          </div>
          <Switch
            checked={settings.updateNotifications}
            onCheckedChange={() => handleSettingChange('updateNotifications')}
          />
        </div>
      </div>
    </div>
  );
}
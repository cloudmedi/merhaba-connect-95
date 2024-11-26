import { supabase } from './client';
import { validateDeviceToken } from './deviceToken';
import { toast } from 'sonner';

interface DeviceStatus {
  status: 'online' | 'offline' | 'maintenance' | 'error';
  systemInfo: any;
  lastError?: string;
  healthStatus?: 'healthy' | 'warning' | 'critical';
}

export async function updateDeviceStatus(
  deviceToken: string, 
  status: DeviceStatus['status'], 
  systemInfo: any
): Promise<{ success: boolean; device?: any; error?: string }> {
  try {
    // MAC adresi kontrolü
    const macAddress = await (window as any).electronAPI.getMacAddress();
    if (!macAddress) {
      throw new Error('MAC adresi alınamadı');
    }

    // Token doğrulama
    const isValid = await validateDeviceToken(deviceToken, macAddress);
    if (!isValid) {
      throw new Error('Geçersiz veya süresi dolmuş token');
    }

    // Sistem sağlığını kontrol et
    const healthStatus = checkSystemHealth(systemInfo);

    // Cihaz durumunu güncelle
    const { data: device, error: updateError } = await supabase
      .from('devices')
      .upsert({
        token: deviceToken,
        status: status,
        system_info: {
          ...systemInfo,
          health: healthStatus,
          last_error: healthStatus === 'critical' ? systemInfo.lastError : null,
          updated_at: new Date().toISOString()
        },
        last_seen: new Date().toISOString(),
      }, {
        onConflict: 'token'
      })
      .select()
      .single();

    if (updateError) throw updateError;

    // Kritik durum varsa bildirim gönder
    if (healthStatus === 'critical') {
      toast.error(`Cihaz durumu kritik: ${systemInfo.lastError || 'Bilinmeyen hata'}`);
    } else if (healthStatus === 'warning') {
      toast.warning('Cihaz performansı düşük');
    }

    return { success: true, device };

  } catch (error: any) {
    console.error('Cihaz durumu güncellenirken hata:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

function checkSystemHealth(systemInfo: any): 'healthy' | 'warning' | 'critical' {
  try {
    const cpuThreshold = 90;
    const memoryThreshold = 90;
    const storageThreshold = 90;

    // CPU kullanımı kontrolü
    if (systemInfo.cpu && systemInfo.cpu.usage > cpuThreshold) {
      return 'critical';
    }

    // Bellek kullanımı kontrolü
    if (systemInfo.memory) {
      const memoryUsage = (systemInfo.memory.used / systemInfo.memory.total) * 100;
      if (memoryUsage > memoryThreshold) {
        return 'critical';
      }
    }

    // Disk kullanımı kontrolü
    if (systemInfo.disk && systemInfo.disk.length > 0) {
      const criticalDisks = systemInfo.disk.filter((disk: any) => 
        (disk.used / disk.size) * 100 > storageThreshold
      );
      
      if (criticalDisks.length > 0) {
        return 'warning';
      }
    }

    // Ağ bağlantısı kontrolü
    if (systemInfo.network && systemInfo.network.length === 0) {
      return 'warning';
    }

    return 'healthy';
  } catch (error) {
    console.error('Sistem sağlığı kontrol edilirken hata:', error);
    return 'warning';
  }
}
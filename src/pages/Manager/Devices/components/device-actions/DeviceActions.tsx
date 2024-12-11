import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Device } from "../../hooks/types";
import { Eye, Pencil, Trash2, PlayCircle, RefreshCw, Clock, MoreVertical, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DeviceActionsProps {
  device: Device;
  onDelete: (id: string) => void;
  onShowDetails: () => void;
  onShowEdit: () => void;
  onShowSchedule: () => void;
}

export function DeviceActions({
  device,
  onDelete,
  onShowDetails,
  onShowEdit,
  onShowSchedule
}: DeviceActionsProps) {
  const handleReset = async () => {
    try {
      const { error } = await supabase
        .from('devices')
        .update({
          status: 'restarting',
          last_seen: new Date().toISOString()
        })
        .eq('id', device.id);

      if (error) throw error;
      toast.success('Cihaz yeniden başlatılıyor');
    } catch (error) {
      console.error('Error resetting device:', error);
      toast.error('Cihaz yeniden başlatılırken bir hata oluştu');
    }
  };

  const handleEmergencyStop = async () => {
    try {
      const { error } = await supabase
        .from('devices')
        .update({
          status: 'emergency_stop',
          last_seen: new Date().toISOString()
        })
        .eq('id', device.id);

      if (error) throw error;
      toast.success('Müzik acil olarak durduruldu');
    } catch (error) {
      console.error('Error emergency stopping device:', error);
      toast.error('Müzik durdurulurken bir hata oluştu');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onShowDetails}>
          <Eye className="h-4 w-4 mr-2" />
          Detaylar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onShowEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Düzenle
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Cihazı Resetle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onShowSchedule}>
          <Clock className="h-4 w-4 mr-2" />
          Güç Programı
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmergencyStop} className="text-red-600">
          <StopCircle className="h-4 w-4 mr-2" />
          Acil Müzik Durdur
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600"
          onClick={() => {
            if (confirm('Bu cihazı silmek istediğinizden emin misiniz?')) {
              onDelete(device.id);
            }
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
import { Button } from "@/components/ui/button";
import { Device } from "../hooks/types";
import { toast } from "sonner";
import { MoreVertical, Eye, Pencil, Trash2, RefreshCw, Clock, StopCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell } from "@/components/ui/table";

interface DeviceActionsProps {
  device: Device;
  onDelete: (id: string) => void;
  onShowDetails: () => void;
  onShowEditDialog: () => void;
  onShowScheduleDialog: () => void;
}

export function DeviceActions({ 
  device, 
  onDelete, 
  onShowDetails, 
  onShowEditDialog,
  onShowScheduleDialog 
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
    <TableCell className="text-right">
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
          <DropdownMenuItem onClick={onShowEditDialog}>
            <Pencil className="h-4 w-4 mr-2" />
            Düzenle
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Cihazı Resetle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onShowScheduleDialog}>
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
    </TableCell>
  );
}
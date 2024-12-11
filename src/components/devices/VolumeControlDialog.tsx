import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VolumeControlDialogProps {
  device: {
    id: string;
    name: string;
    volume?: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface VolumeHistory {
  volume: number;
  created_at: string;
  profiles: {
    first_name?: string | null;
    last_name?: string | null;
  } | null;
}

export function VolumeControlDialog({ device, open, onOpenChange }: VolumeControlDialogProps) {
  const [volume, setVolume] = useState(device.volume || 50);
  const [history, setHistory] = useState<VolumeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadVolumeHistory();
    }
  }, [open, device.id]);

  const loadVolumeHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('device_volume_history')
        .select(`
          volume,
          created_at,
          profiles:changed_by (
            first_name,
            last_name
          )
        `)
        .eq('device_id', device.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading volume history:', error);
      toast.error('Ses geçmişi yüklenirken bir hata oluştu');
    }
  };

  const handleVolumeChange = async (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    setIsLoading(true);

    try {
      // Update device volume
      const { error: deviceError } = await supabase
        .from('devices')
        .update({ volume: newVolume })
        .eq('id', device.id);

      if (deviceError) throw deviceError;

      // Add to history
      const { error: historyError } = await supabase
        .from('device_volume_history')
        .insert({
          device_id: device.id,
          volume: newVolume,
        });

      if (historyError) throw historyError;

      toast.success('Ses seviyesi güncellendi');
      loadVolumeHistory();
    } catch (error) {
      console.error('Error updating volume:', error);
      toast.error('Ses seviyesi güncellenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Ses Kontrolü - {device.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">Ses Seviyesi: {volume}%</label>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Ses Geçmişi</h3>
            <ScrollArea className="h-[200px] rounded-md border">
              <div className="p-4 space-y-2">
                {history.map((entry, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-gray-500" />
                      <span>%{entry.volume}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">
                        {entry.profiles?.first_name} {entry.profiles?.last_name}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: tr })}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
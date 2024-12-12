import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { VolumeHistory } from "@/types/api";

interface VolumeControlDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deviceId: string;
  currentVolume: number;
  onVolumeChange: (volume: number) => void;
}

export function VolumeControlDialog({
  isOpen,
  onClose,
  deviceId,
  currentVolume,
  onVolumeChange,
}: VolumeControlDialogProps) {
  const [volume, setVolume] = useState(currentVolume);
  const [volumeHistory, setVolumeHistory] = useState<VolumeHistory[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchVolumeHistory();
    }
  }, [isOpen, deviceId]);

  const fetchVolumeHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('device_volume_history')
        .select('volume, created_at, changed_by')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data) {
        setVolumeHistory(data);
      }
    } catch (error) {
      console.error('Error fetching volume history:', error);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    onVolumeChange(value[0]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Volume Control</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
          />
          <div className="text-center mt-2 text-sm text-gray-500">
            Current Volume: {volume}%
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Volume History</h4>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {volumeHistory.map((history, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm py-2 border-b last:border-0"
                >
                  <div>
                    <span className="font-medium">{history.volume}%</span>
                  </div>
                  <span className="text-gray-500">
                    {format(new Date(history.created_at), 'MMM d, HH:mm')}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
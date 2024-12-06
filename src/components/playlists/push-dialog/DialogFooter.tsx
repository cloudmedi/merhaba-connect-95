import { Button } from "@/components/ui/button";

interface DialogFooterProps {
  selectedCount: number;
  isSyncing: boolean;
  onCancel: () => void;
  onPush: (selectedDevices: string[]) => void;
  selectedDevices: string[];
}

export function DialogFooter({ 
  selectedCount, 
  isSyncing, 
  onCancel, 
  onPush,
  selectedDevices 
}: DialogFooterProps) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-gray-500">
        {selectedCount} cihaz seçildi
      </p>
      <div className="space-x-2">
        <Button variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button 
          onClick={() => onPush(selectedDevices)} 
          disabled={isSyncing}
        >
          {isSyncing ? "Gönderiliyor..." : "Cihazlara Gönder"}
        </Button>
      </div>
    </div>
  );
}
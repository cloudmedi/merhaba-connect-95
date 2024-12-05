import { Button } from "@/components/ui/button";

interface DialogFooterProps {
  selectedCount: number;
  onCancel: () => void;
  onPush: () => void;
  isSyncing: boolean;
}

export function DialogFooter({ selectedCount, onCancel, onPush, isSyncing }: DialogFooterProps) {
  return (
    <div className="flex items-center justify-between border-t pt-4">
      <p className="text-sm text-gray-500">
        {selectedCount} cihaz seçildi
      </p>
      <div className="space-x-2">
        <Button variant="outline" onClick={onCancel} disabled={isSyncing}>
          İptal
        </Button>
        <Button 
          onClick={onPush}
          disabled={selectedCount === 0 || isSyncing}
          className="bg-[#1A1F2C] text-white hover:bg-[#2A2F3C]"
        >
          {isSyncing ? 'Gönderiliyor...' : 'Cihazlara Gönder'}
        </Button>
      </div>
    </div>
  );
}
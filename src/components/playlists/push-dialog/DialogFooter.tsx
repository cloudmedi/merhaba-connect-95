import { Button } from "@/components/ui/button";

export interface DialogFooterProps {
  selectedCount: number;
  onCancel: () => void;
  onPush: () => void;
  isSyncing: boolean;
}

export function DialogFooter({ 
  selectedCount, 
  onCancel, 
  onPush, 
  isSyncing 
}: DialogFooterProps) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-gray-500">
        {selectedCount} cihaz seçildi
      </p>
      <div className="space-x-2">
        <Button variant="outline" onClick={onCancel} disabled={isSyncing}>
          İptal
        </Button>
        <Button onClick={onPush} disabled={selectedCount === 0 || isSyncing}>
          {isSyncing ? 'Gönderiliyor...' : 'Cihazlara Gönder'}
        </Button>
      </div>
    </div>
  );
}
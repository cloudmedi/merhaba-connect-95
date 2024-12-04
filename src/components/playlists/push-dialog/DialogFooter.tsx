import { Button } from "@/components/ui/button";

interface DialogFooterProps {
  selectedCount: number;
  onCancel: () => void;
  onPush: () => void;
}

export function DialogFooter({ selectedCount, onCancel, onPush }: DialogFooterProps) {
  return (
    <div className="flex items-center justify-between border-t pt-4">
      <p className="text-sm text-gray-500">
        {selectedCount} cihaz seçildi
      </p>
      <div className="space-x-2">
        <Button variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button 
          onClick={onPush}
          disabled={selectedCount === 0}
          className="bg-[#1A1F2C] text-white hover:bg-[#2A2F3C]"
        >
          Cihazlara Gönder
        </Button>
      </div>
    </div>
  );
}
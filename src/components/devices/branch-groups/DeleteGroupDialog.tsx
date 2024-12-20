import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import api from "@/lib/api";

interface DeleteGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string | null;
  onDeleted: () => Promise<void>;
}

export function DeleteGroupDialog({ isOpen, onClose, groupId, onDeleted }: DeleteGroupDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!groupId || isDeleting) return;

    setIsDeleting(true);
    try {
      console.log('Starting deletion process for group:', groupId);

      // Delete group assignments first
      await api.delete(`/branch-groups/${groupId}/assignments`);
      console.log('Successfully deleted group assignments');

      // Then delete the group
      await api.delete(`/branch-groups/${groupId}`);
      console.log('Successfully deleted group');

      toast.success("Grup başarıyla silindi");
      onClose();
      await onDeleted();
    } catch (error) {
      console.error('Error in delete operation:', error);
      toast.error("Grup silinirken bir hata oluştu");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Grubu Sil</AlertDialogTitle>
          <AlertDialogDescription>
            Bu grubu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? 'Siliniyor...' : 'Sil'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
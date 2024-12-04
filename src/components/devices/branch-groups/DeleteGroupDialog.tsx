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
import { supabase } from "@/integrations/supabase/client";

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
      // Önce grup atamalarını sil
      const { error: assignmentsError } = await supabase
        .from('branch_group_assignments')
        .delete()
        .eq('group_id', groupId);

      if (assignmentsError) throw assignmentsError;

      // Sonra grubu sil
      const { error: groupError } = await supabase
        .from('branch_groups')
        .delete()
        .eq('id', groupId);

      if (groupError) throw groupError;

      toast.success("Grup başarıyla silindi");
      await onDeleted();
      onClose();
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
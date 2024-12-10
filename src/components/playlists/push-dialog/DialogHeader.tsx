import { DialogHeader as BaseDialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DialogHeaderProps {
  title: string;
}

export function DialogHeader({ title }: DialogHeaderProps) {
  return (
    <BaseDialogHeader>
      <DialogTitle>{title}</DialogTitle>
    </BaseDialogHeader>
  );
}
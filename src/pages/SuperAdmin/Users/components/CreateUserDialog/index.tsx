import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { UserForm } from "./UserForm";
import { FormValues } from "./formSchema";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const handleSubmit = async (values: FormValues) => {
    try {
      // Simüle edilmiş başarılı yanıt
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Kullanıcı başarıyla oluşturuldu");
      onOpenChange(false);
    } catch (error) {
      toast.error("Kullanıcı oluşturulurken bir hata oluştu");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Yeni Kullanıcı Oluştur</DialogTitle>
          <DialogDescription>
            Yeni bir kullanıcı ekleyin. Kullanıcı giriş bilgileri email ile gönderilecektir.
          </DialogDescription>
        </DialogHeader>
        <UserForm 
          onSubmit={handleSubmit}
          isSubmitting={false}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
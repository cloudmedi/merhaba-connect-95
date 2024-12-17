import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role?: string;
  };
}

export function EditUserDialog({ isOpen, onClose, user }: EditUserDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: user.first_name || "",
    lastName: user.last_name || "",
    email: user.email || "",
    role: user.role || "user",
    password: ""
  });

  useEffect(() => {
    setFormData({
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      email: user.email || "",
      role: user.role || "user",
      password: ""
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          role: formData.role
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Kullanıcı bilgileri güncellendi",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kullanıcı Düzenle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Ad</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Soyad</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit">
              Kaydet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
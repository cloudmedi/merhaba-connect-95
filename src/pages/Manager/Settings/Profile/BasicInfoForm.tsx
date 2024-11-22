import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BasicInfoFormProps {
  user: User;
}

export function BasicInfoForm({ user }: BasicInfoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("Kullanıcı bilgisi bulunamadı");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success("Profil başarıyla güncellendi");
    } catch (error) {
      toast.error("Profil güncellenirken bir hata oluştu");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            Ad
          </label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Soyad
          </label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="bg-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          E-posta
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          disabled
          className="bg-gray-50"
        />
        <p className="text-xs text-gray-500 mt-1">
          E-posta adresinizi değiştirmek için destek ekibiyle iletişime geçin
        </p>
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white px-6"
        >
          {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </Button>
      </div>
    </form>
  );
}
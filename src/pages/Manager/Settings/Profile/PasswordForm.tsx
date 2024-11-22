import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Yeni şifreler eşleşmiyor");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast.success("Şifre başarıyla güncellendi");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Şifre güncellenirken bir hata oluştu");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handlePasswordChange} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="currentPassword" className="text-sm font-medium">
          Mevcut Şifre
        </label>
        <Input
          id="currentPassword"
          type="password"
          value={passwordData.currentPassword}
          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
          className="bg-white"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="newPassword" className="text-sm font-medium">
          Yeni Şifre
        </label>
        <Input
          id="newPassword"
          type="password"
          value={passwordData.newPassword}
          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
          className="bg-white"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Yeni Şifre (Tekrar)
        </label>
        <Input
          id="confirmPassword"
          type="password"
          value={passwordData.confirmPassword}
          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          className="bg-white"
        />
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white px-6"
        >
          {isLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        </Button>
      </div>
    </form>
  );
}
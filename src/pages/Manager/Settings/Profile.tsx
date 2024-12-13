import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

export default function ProfileSettings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      toast.success("Profil fotoğrafı başarıyla güncellendi");
    } catch (error) {
      console.error(error);
      toast.error("Profil fotoğrafı güncellenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
        })
        .eq('id', user?.id);

      if (error) throw error;
      toast.success("Profil başarıyla güncellendi");
    } catch (error) {
      toast.error("Profil güncellenirken bir hata oluştu");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Profil Ayarları</h1>
        <p className="text-sm text-gray-500">Hesap bilgilerinizi ve tercihlerinizi yönetin</p>
      </div>

      <Card className="p-8">
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-[#9b87f5]/10 text-[#9b87f5] h-full w-full flex items-center justify-center text-2xl font-medium">
                  {user?.firstName?.[0] || user?.email[0].toUpperCase()}
                </div>
              )}
            </Avatar>
            <div>
              <Button 
                variant="outline" 
                className="relative"
                disabled={isLoading}
              >
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
                <Upload className="w-4 h-4 mr-2" />
                Fotoğraf Yükle
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG formatında max. 2MB
              </p>
            </div>
          </div>
        </div>

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

        <Separator className="my-10" />

        <div className="space-y-6">
          <h2 className="text-lg font-medium">Şifre Değiştir</h2>
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
        </div>
      </Card>
    </div>
  );
}

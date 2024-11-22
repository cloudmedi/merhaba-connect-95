import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";

interface AvatarUploadProps {
  user: User;
}

export function AvatarUpload({ user }: AvatarUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Dosya boyutu 2MB'dan küçük olmalıdır");
        return;
      }

      setIsLoading(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      
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
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Refresh the page to update the avatar
      window.location.reload();

      toast.success("Profil fotoğrafı başarıyla güncellendi");
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error("Profil fotoğrafı güncellenirken bir hata oluştu: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="bg-[#9b87f5]/10 text-[#9b87f5] h-full w-full flex items-center justify-center text-2xl font-medium">
              {user.firstName?.[0] || user.email[0].toUpperCase()}
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
              disabled={isLoading}
            />
            <Upload className="w-4 h-4 mr-2" />
            {isLoading ? "Yükleniyor..." : "Fotoğraf Yükle"}
          </Button>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG formatında max. 2MB
          </p>
        </div>
      </div>
    </div>
  );
}
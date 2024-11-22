import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@/types/auth";

interface AvatarUploadProps {
  user: User;
  onAvatarUpdate: (url: string) => void;
}

export function AvatarUpload({ user, onAvatarUpdate }: AvatarUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
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

      onAvatarUpdate(publicUrl);
      toast.success("Profil fotoğrafı başarıyla güncellendi");
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error("Profil fotoğrafı güncellenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
}
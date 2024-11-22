import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface AvatarSectionProps {
  user: User;
}

export function AvatarSection({ user }: AvatarSectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0 || !user?.id) {
        return;
      }

      setIsLoading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success("Profil fotoğrafı güncellendi");
      window.location.reload();
    } catch (error) {
      toast.error("Profil fotoğrafı güncellenirken bir hata oluştu");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-6 mb-6">
      <Avatar className="w-20 h-20">
        <AvatarImage src={user?.avatar_url} />
        <AvatarFallback className="bg-primary/10">
          {user?.firstName?.[0] || user?.email?.[0]}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-medium mb-1">Profil Fotoğrafı</h3>
        <p className="text-sm text-gray-500 mb-2">JPG, PNG veya GIF. Maksimum 2MB.</p>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
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
            Fotoğraf Yükle
          </Button>
        </div>
      </div>
    </div>
  );
}
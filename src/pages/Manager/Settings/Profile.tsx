import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordForm } from "@/components/profile/PasswordForm";

export default function ProfileSettings() {
  const { user, updateUserProfile } = useAuth();

  if (!user) return null;

  const handleProfileUpdate = (firstName: string, lastName: string) => {
    updateUserProfile({
      ...user,
      firstName,
      lastName,
    });
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    updateUserProfile({
      ...user,
      avatar_url: avatarUrl,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Profil Ayarları</h1>
        <p className="text-sm text-gray-500">Hesap bilgilerinizi ve tercihlerinizi yönetin</p>
      </div>

      <Card className="p-8">
        <div className="mb-6">
          <AvatarUpload user={user} onAvatarUpdate={handleAvatarUpdate} />
        </div>

        <ProfileForm user={user} onProfileUpdate={handleProfileUpdate} />

        <Separator className="my-10" />

        <div className="space-y-6">
          <h2 className="text-lg font-medium">Şifre Değiştir</h2>
          <PasswordForm />
        </div>
      </Card>
    </div>
  );
}
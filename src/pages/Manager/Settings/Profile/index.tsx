import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { AvatarSection } from "./AvatarSection";
import { BasicInfoForm } from "./BasicInfoForm";
import { PasswordForm } from "./PasswordForm";

export default function ProfileSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user?.id) {
    navigate('/manager/login');
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Profil Ayarları</h1>
        <p className="text-sm text-gray-500">Hesap bilgilerinizi ve tercihlerinizi yönetin</p>
      </div>

      <Card className="p-8">
        <AvatarSection user={user} />
        <BasicInfoForm user={user} />
        
        <Separator className="my-10" />

        <div className="space-y-6">
          <h2 className="text-lg font-medium">Şifre Değiştir</h2>
          <PasswordForm />
        </div>
      </Card>
    </div>
  );
}
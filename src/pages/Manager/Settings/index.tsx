import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "./ProfileSettings";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ayarlar</h1>
        <p className="text-sm text-gray-500">Hesap ve uygulama ayarlarınızı yönetin</p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
            <TabsTrigger value="appearance">Görünüm</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="p-4">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="notifications" className="p-4">
            <div className="text-gray-500">
              Bildirim tercihleri yakında eklenecek
            </div>
          </TabsContent>
          <TabsContent value="appearance" className="p-4">
            <div className="text-gray-500">
              Görünüm ayarları yakında eklenecek
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
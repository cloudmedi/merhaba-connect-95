import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProfileSettings from "./Profile";
import { NotificationSettings } from "./NotificationSettings";
import { AppearanceSettings } from "./AppearanceSettings";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/profile" element={<ProfileSettings />} />
      <Route path="/" element={
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">Ayarlar</h1>
            <p className="text-sm text-gray-500">Hesap ve uygulama ayarlarınızı yönetin</p>
          </div>

          <Card className="p-6">
            <Tabs defaultValue="hesap" onValueChange={(value) => {
              if (value === "hesap") {
                navigate("/manager/settings/profile");
              }
            }}>
              <TabsList className="w-full border-b pb-0 mb-4">
                <TabsTrigger 
                  value="hesap"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#6E59A5] rounded-none"
                >
                  Hesap
                </TabsTrigger>
                <TabsTrigger 
                  value="bildirimler"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#6E59A5] rounded-none"
                >
                  Bildirimler
                </TabsTrigger>
                <TabsTrigger 
                  value="gorunum"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#6E59A5] rounded-none"
                >
                  Görünüm
                </TabsTrigger>
              </TabsList>
              <TabsContent value="hesap">
                <ProfileSettings />
              </TabsContent>
              <TabsContent value="bildirimler">
                <NotificationSettings />
              </TabsContent>
              <TabsContent value="gorunum">
                <AppearanceSettings />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      } />
    </Routes>
  );
}
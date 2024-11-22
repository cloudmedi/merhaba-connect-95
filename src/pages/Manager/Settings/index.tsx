import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProfileSettings from "./Profile";

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
            <Tabs defaultValue="account" onValueChange={(value) => {
              if (value === "account") {
                navigate("/manager/settings/profile");
              }
            }}>
              <TabsList>
                <TabsTrigger value="account">Hesap</TabsTrigger>
                <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
                <TabsTrigger value="appearance">Görünüm</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="p-4">
                <div className="text-gray-500">
                  Hesap ayarları burada görüntülenecek
                </div>
              </TabsContent>
              <TabsContent value="notifications" className="p-4">
                <div className="text-gray-500">
                  Bildirim tercihleri burada görüntülenecek
                </div>
              </TabsContent>
              <TabsContent value="appearance" className="p-4">
                <div className="text-gray-500">
                  Görünüm ayarları burada görüntülenecek
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      } />
    </Routes>
  );
}
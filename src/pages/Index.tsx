import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Music2, Building2, Calendar, Activity } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              İşletmenizin Müzik Yönetimi Artık Daha Kolay
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Tüm şubelerinizin müzik ve duyuru sistemini tek platformdan yönetin. 
              Profesyonel müzik yönetim çözümü ile işletmenizi bir adım öne taşıyın.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button 
                className="bg-gray-900 hover:bg-gray-800"
                onClick={() => navigate("/manager/register")}
              >
                Ücretsiz Deneyin
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/contact")}
              >
                Demo Talep Et
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Öne Çıkan Özellikler
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Modern ve kullanıcı dostu arayüz ile tüm müzik sisteminizi kolayca yönetin
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {/* Feature 1 */}
              <Card className="hover:shadow-lg transition-shadow border-0">
                <CardHeader>
                  <Music2 className="h-8 w-8 text-gray-900" />
                  <CardTitle className="mt-4">Merkezi Müzik Yönetimi</CardTitle>
                  <CardDescription>
                    Tüm playlist'lerinizi tek noktadan yönetin ve kontrol edin
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 2 */}
              <Card className="hover:shadow-lg transition-shadow border-0">
                <CardHeader>
                  <Building2 className="h-8 w-8 text-gray-900" />
                  <CardTitle className="mt-4">Çoklu Şube Kontrolü</CardTitle>
                  <CardDescription>
                    Farklı lokasyonlar için özelleştirilmiş müzik akışı sağlayın
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 3 */}
              <Card className="hover:shadow-lg transition-shadow border-0">
                <CardHeader>
                  <Calendar className="h-8 w-8 text-gray-900" />
                  <CardTitle className="mt-4">Akıllı Programlama</CardTitle>
                  <CardDescription>
                    Otomatik müzik ve duyuru programlama ile zamandan tasarruf edin
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 4 */}
              <Card className="hover:shadow-lg transition-shadow border-0">
                <CardHeader>
                  <Activity className="h-8 w-8 text-gray-900" />
                  <CardTitle className="mt-4">Gerçek Zamanlı İzleme</CardTitle>
                  <CardDescription>
                    Cihaz durumlarını ve müzik akışını anlık olarak takip edin
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Panels Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Yönetim Panelleri
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              İhtiyacınıza uygun yönetim paneli ile sisteminizi kontrol edin
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-2">
            {/* Super Admin Panel */}
            <Card className="hover:shadow-lg transition-shadow border border-gray-100">
              <CardHeader>
                <CardTitle>Super Admin Panel</CardTitle>
                <CardDescription>
                  Tüm sistem yönetimi için gelişmiş kontrol paneli
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800"
                  onClick={() => navigate("/super-admin/login")}
                >
                  Super Admin Girişi
                </Button>
              </CardContent>
            </Card>

            {/* Manager Panel */}
            <Card className="hover:shadow-lg transition-shadow border border-gray-100">
              <CardHeader>
                <CardTitle>Manager Panel</CardTitle>
                <CardDescription>
                  Şube yönetimi için özelleştirilmiş kontrol paneli
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800"
                  onClick={() => navigate("/manager/login")}
                >
                  Manager Girişi
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
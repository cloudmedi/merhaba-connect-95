import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Music2, Building2, Calendar, Activity, ArrowLeft } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="text-gray-600 gap-2"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4" />
                Giriş
              </Button>
            </div>
            <div>
              <Button 
                className="bg-[#6E59A5] hover:bg-[#5A478A]"
                onClick={() => navigate("/manager/register")}
              >
                Ücretsiz Deneyin
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              İşletmenizin Müzik Yönetimi<br />Artık Daha Kolay
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Tüm şubelerinizin müzik ve duyuru sistemini tek platformdan yönetin.
              Profesyonel müzik yönetim çözümü ile işletmenizi bir adım öne taşıyın.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-[#6E59A5] hover:bg-[#5A478A]"
                onClick={() => navigate("/manager/register")}
              >
                Hemen Başlayın
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => {}}
              >
                Demo Talep Et
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Öne Çıkan Özellikler
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              İşletmenizin müzik yönetimini kolaylaştıran profesyonel çözümler
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Music2 className="h-8 w-8 text-[#6E59A5] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Merkezi Müzik Yönetimi</h3>
              <p className="text-gray-600">Tüm playlist'lerinizi tek noktadan yönetin</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Building2 className="h-8 w-8 text-[#6E59A5] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Çoklu Şube Kontrolü</h3>
              <p className="text-gray-600">Farklı lokasyonlar için özelleştirilmiş müzik akışı</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Calendar className="h-8 w-8 text-[#6E59A5] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Akıllı Programlama</h3>
              <p className="text-gray-600">Otomatik müzik ve duyuru programlama</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Activity className="h-8 w-8 text-[#6E59A5] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gerçek Zamanlı İzleme</h3>
              <p className="text-gray-600">Cihaz durumlarını anlık takip edin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#6E59A5] mb-2">500+</div>
              <div className="text-gray-600">Aktif İşletme</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#6E59A5] mb-2">1000+</div>
              <div className="text-gray-600">Toplam Şube</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#6E59A5] mb-2">5000+</div>
              <div className="text-gray-600">Aktif Playlist</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#6E59A5] mb-2">50K+</div>
              <div className="text-gray-600">Toplam Müzik</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
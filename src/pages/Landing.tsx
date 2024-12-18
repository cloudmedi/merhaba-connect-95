import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Music2, Building2, Calendar, Activity, ArrowLeft, Check } from "lucide-react";
import { Footer } from "@/components/landing/Footer";

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
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                İşletmenizi<br />
                <span className="text-[#6E59A5]">Mükemmel Müzik</span><br />
                ile Yükseltin
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Tüm şubelerinizin müzik sistemini tek platformdan yönetin. 
                Profesyonel müzik yönetimi ile müşterilerinize unutulmaz deneyimler yaşatın.
              </p>
              <div className="flex gap-4">
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
                  Demo İsteyin
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/0710ec28-9012-4d14-8efa-2fc875f48e24.png" 
                alt="İşletme Görseli"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Playlists */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Haftalık Özel Playlist'ler
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              İşletmeniz için özenle seçilmiş playlist'ler ile müşterilerinize en iyi deneyimi yaşatın
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-square bg-gray-100 animate-pulse" />
                <div className="p-4">
                  <div className="h-4 bg-gray-100 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Güçlü Özellikler
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

      {/* Pricing Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Şeffaf Fiyatlandırma
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              İhtiyacınıza en uygun paketi seçin
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Başlangıç</h3>
              <div className="text-4xl font-bold mb-6">₺499<span className="text-lg text-gray-500">/ay</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#6E59A5]" />
                  <span>1 Şube</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#6E59A5]" />
                  <span>5 Playlist</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#6E59A5]" />
                  <span>Email Destek</span>
                </li>
              </ul>
              <Button className="w-full bg-[#6E59A5] hover:bg-[#5A478A]">
                Başlayın
              </Button>
            </div>

            {/* Professional */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-[#6E59A5] relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#6E59A5] text-white px-4 py-1 rounded-full text-sm">
                  En Popüler
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Profesyonel</h3>
              <div className="text-4xl font-bold mb-6">₺999<span className="text-lg text-gray-500">/ay</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#6E59A5]" />
                  <span>5 Şube</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#6E59A5]" />
                  <span>Sınırsız Playlist</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#6E59A5]" />
                  <span>7/24 Destek</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#6E59A5]" />
                  <span>Gelişmiş Raporlama</span>
                </li>
              </ul>
              <Button className="w-full bg-[#6E59A5] hover:bg-[#5A478A]">
                Hemen Başlayın
              </Button>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Kurumsal</h3>
              <div className="text-4xl font-bold mb-6">₺1999<span className="text-lg text-gray-500">/ay</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#6E59A5]" />
                  <span>Sınırsız Şube</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#6E59A5]" />
                  <span>Özel API Erişimi</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#6E59A5]" />
                  <span>Öncelikli Destek</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#6E59A5]" />
                  <span>Özel Entegrasyonlar</span>
                </li>
              </ul>
              <Button className="w-full bg-[#6E59A5] hover:bg-[#5A478A]">
                İletişime Geçin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
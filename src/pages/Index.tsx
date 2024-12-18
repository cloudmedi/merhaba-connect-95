import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Activity, Building2, Calendar, DollarSign, Users, LayoutGrid, ArrowRight, Check } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b fixed w-full bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold">Merhaba Connect</div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate("/manager/login")}>
                Giriş Yap
              </Button>
              <Button onClick={() => navigate("/manager/register")}>
                Ücretsiz Deneyin
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
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
              onClick={() => navigate("/manager/register")}
              className="bg-[#6E59A5] hover:bg-[#5A478A]"
            >
              Hemen Başlayın
            </Button>
            <Button 
              size="lg"
              variant="outline"
            >
              Demo Talep Et
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
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
              <Activity className="h-8 w-8 text-[#6E59A5] mb-4" />
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
              <LayoutGrid className="h-8 w-8 text-[#6E59A5] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gerçek Zamanlı İzleme</h3>
              <p className="text-gray-600">Cihaz durumlarını anlık takip edin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Apps Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Yönetim Panelleri
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              İhtiyacınıza uygun yönetim paneli ile işletmenizi yönetin
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <Users className="h-12 w-12 text-[#6E59A5] mb-6" />
              <h3 className="text-2xl font-bold mb-4">Super Admin Panel</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Merkezi kullanıcı yönetimi</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Detaylı raporlama ve analiz</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Gelişmiş sistem ayarları</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => navigate("/super-admin")}
              >
                Super Admin'e Git
              </Button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <Building2 className="h-12 w-12 text-[#6E59A5] mb-6" />
              <h3 className="text-2xl font-bold mb-4">Manager Panel</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Şube bazlı müzik yönetimi</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Playlist ve program kontrolü</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Cihaz yönetimi ve izleme</span>
                </li>
              </ul>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate("/manager")}
              >
                Manager Panel'e Git
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fiyatlandırma
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              İşletmenizin büyüklüğüne göre uygun paketler
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h3 className="text-xl font-bold mb-2">Başlangıç</h3>
              <div className="text-3xl font-bold mb-6">₺499<span className="text-sm font-normal text-gray-600">/ay</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>5 şubeye kadar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Temel özellikler</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Email desteği</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">Paketi Seç</Button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#6E59A5] text-white px-4 py-1 rounded-full text-sm">
                En Popüler
              </div>
              <h3 className="text-xl font-bold mb-2">Profesyonel</h3>
              <div className="text-3xl font-bold mb-6">₺999<span className="text-sm font-normal text-gray-600">/ay</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>20 şubeye kadar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Tüm özellikler</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>7/24 destek</span>
                </li>
              </ul>
              <Button className="w-full bg-[#6E59A5] hover:bg-[#5A478A]">Paketi Seç</Button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h3 className="text-xl font-bold mb-2">Kurumsal</h3>
              <div className="text-3xl font-bold mb-6">Özel<span className="text-sm font-normal text-gray-600">/ay</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Sınırsız şube</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Özel entegrasyonlar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Öncelikli destek</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">İletişime Geç</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4">
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

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Merhaba Connect</h4>
              <p className="text-gray-600 text-sm">
                Profesyonel müzik yönetim çözümü ile işletmenizi bir adım öne taşıyın.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Ürün</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Özellikler</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Fiyatlandırma</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Şirket</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Hakkımızda</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">İletişim</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Destek</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Yardım Merkezi</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Dokümantasyon</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 Merhaba Connect. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
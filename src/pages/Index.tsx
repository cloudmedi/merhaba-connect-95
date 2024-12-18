import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Music2, Building2, PlayCircle, Calendar, Bell, BarChart3 } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6E59A5] to-[#9b87f5]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6 text-white mb-20">
          <h1 className="text-5xl font-bold tracking-tight">
            İşletmeniz İçin Profesyonel Müzik Yönetimi
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Tüm şubelerinizde tek merkezden müzik yönetimi, otomatik programlama ve 
            anlık duyuru sistemi ile işletmenizi bir üst seviyeye taşıyın.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button 
              size="lg"
              className="bg-white text-[#6E59A5] hover:bg-white/90"
              onClick={() => navigate("/manager/register")}
            >
              Hemen Başlayın
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10"
              onClick={() => navigate("/manager/login")}
            >
              Giriş Yap
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-white">
              <PlayCircle className="w-12 h-12 mb-4 text-white/80" />
              <h3 className="text-xl font-semibold mb-2">Merkezi Müzik Yönetimi</h3>
              <p className="text-white/70">
                Tüm şubelerinizde çalan müzikleri tek bir merkezden kolayca yönetin.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-white">
              <Calendar className="w-12 h-12 mb-4 text-white/80" />
              <h3 className="text-xl font-semibold mb-2">Akıllı Programlama</h3>
              <p className="text-white/70">
                Müzik listelerinizi günlere ve saatlere göre otomatik olarak programlayın.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-white">
              <Bell className="w-12 h-12 mb-4 text-white/80" />
              <h3 className="text-xl font-semibold mb-2">Anlık Duyurular</h3>
              <p className="text-white/70">
                Şubelerinize özel duyurularınızı anında yayınlayın ve yönetin.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin/Manager Access */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-20">
          <Card className="bg-white shadow-xl hover:shadow-2xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <Music2 className="h-12 w-12 text-[#6E59A5]" />
                <h3 className="text-2xl font-semibold text-gray-900">
                  Süper Admin Paneli
                </h3>
                <p className="text-gray-600">
                  Tüm şubelerin merkezi yönetim sistemi
                </p>
                <Button 
                  className="w-full bg-[#6E59A5] hover:bg-[#5a478a]" 
                  onClick={() => navigate("/super-admin")}
                >
                  Süper Admin Girişi
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl hover:shadow-2xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <Building2 className="h-12 w-12 text-[#6E59A5]" />
                <h3 className="text-2xl font-semibold text-gray-900">
                  Şube Yönetim Paneli
                </h3>
                <p className="text-gray-600">
                  Şube bazlı müzik ve duyuru yönetimi
                </p>
                <Button 
                  variant="outline"
                  className="w-full border-[#6E59A5] text-[#6E59A5] hover:bg-[#6E59A5] hover:text-white"
                  onClick={() => navigate("/manager")}
                >
                  Şube Yönetici Girişi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center text-white">
          <h2 className="text-3xl font-bold mb-12">Rakamlarla Merhaba Connect</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <BarChart3 className="w-8 h-8 mx-auto text-white/80" />
              <div className="text-4xl font-bold">1000+</div>
              <div className="text-white/70">Aktif Şube</div>
            </div>
            <div className="space-y-2">
              <Music2 className="w-8 h-8 mx-auto text-white/80" />
              <div className="text-4xl font-bold">5000+</div>
              <div className="text-white/70">Şarkı</div>
            </div>
            <div className="space-y-2">
              <PlayCircle className="w-8 h-8 mx-auto text-white/80" />
              <div className="text-4xl font-bold">500+</div>
              <div className="text-white/70">Playlist</div>
            </div>
            <div className="space-y-2">
              <Bell className="w-8 h-8 mx-auto text-white/80" />
              <div className="text-4xl font-bold">10K+</div>
              <div className="text-white/70">Duyuru</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TrialForm } from "@/components/landing/TrialForm";
import { 
  Music2, 
  BarChart3, 
  Calendar, 
  Building2, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [isTrialFormOpen, setIsTrialFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b fixed w-full bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Button 
              variant="ghost" 
              className="text-xl font-semibold text-[#6E59A5]"
              onClick={() => navigate("/")}
            >
              MusicBiz
            </Button>

            <div className="hidden md:flex items-center gap-8">
              <Button variant="ghost" className="text-gray-600">Özellikler</Button>
              <Button variant="ghost" className="text-gray-600">Çözümler</Button>
              <Button variant="ghost" className="text-gray-600">Fiyatlandırma</Button>
              <Button variant="ghost" className="text-gray-600">Blog</Button>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="ghost"
                onClick={() => navigate("/manager/login")}
                className="hidden md:inline-flex"
              >
                Giriş Yap
              </Button>
              <Button 
                className="bg-[#6E59A5] hover:bg-[#5A478A] gap-2"
                onClick={() => setIsTrialFormOpen(true)}
              >
                Ücretsiz Deneyin <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                İşletmeniz için
                <span className="text-[#6E59A5] block mt-2">
                  Profesyonel Müzik Yönetimi
                </span>
              </h1>
              <p className="text-gray-600 text-lg max-w-xl">
                Merkezi müzik yönetimi, akıllı programlama ve gerçek zamanlı izleme özellikleriyle işletmenizin atmosferini kontrol edin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-[#6E59A5] hover:bg-[#5A478A] h-12 px-8 gap-2"
                  onClick={() => setIsTrialFormOpen(true)}
                >
                  14 Gün Ücretsiz Deneyin <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-[#6E59A5] text-[#6E59A5] hover:bg-[#6E59A5] hover:text-white h-12 px-8"
                >
                  Demo İzleyin
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#6E59A5]" />
                  <span className="text-gray-600">10.000+ Şarkı</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#6E59A5]" />
                  <span className="text-gray-600">7/24 Destek</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#6E59A5]" />
                  <span className="text-gray-600">Kolay Kurulum</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -z-10 w-[500px] h-[500px] bg-[#F3F0FF] rounded-full blur-3xl opacity-30 -right-20 -top-20" />
              <img
                src="/placeholder.svg"
                alt="Dashboard Preview"
                className="w-full rounded-2xl shadow-2xl border border-gray-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Temel Özellikler
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              İşletmenizin müzik yönetimini kolaylaştıran profesyonel çözümler
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#F3F0FF] rounded-lg flex items-center justify-center mb-6">
                <Music2 className="w-6 h-6 text-[#6E59A5]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Merkezi Müzik Yönetimi</h3>
              <p className="text-gray-600">Tüm şubelerinizin müzik sistemini tek bir panelden yönetin ve kontrol edin.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#F3F0FF] rounded-lg flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-[#6E59A5]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Akıllı Programlama</h3>
              <p className="text-gray-600">Günün saatine ve yoğunluğa göre otomatik müzik ve duyuru programlama.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#F3F0FF] rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-[#6E59A5]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Detaylı Raporlama</h3>
              <p className="text-gray-600">Çalma listeleri ve müzik akışı hakkında detaylı istatistikler ve raporlar.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#F3F0FF] rounded-lg flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-[#6E59A5]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Çoklu Şube Desteği</h3>
              <p className="text-gray-600">Farklı lokasyonlar için özelleştirilmiş müzik ve duyuru yönetimi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Müşteri Deneyimini Zirveye Taşıyın
              </h2>
              <p className="text-gray-600">
                Profesyonel müzik direktörlerimiz tarafından hazırlanan playlist'ler ile 
                işletmenizin atmosferini güçlendirin.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-bold text-[#6E59A5] mb-2">10.000+</div>
                  <div className="text-gray-600">Telifsiz Şarkı</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#6E59A5] mb-2">500+</div>
                  <div className="text-gray-600">Aktif İşletme</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#6E59A5] mb-2">24/7</div>
                  <div className="text-gray-600">Teknik Destek</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#6E59A5] mb-2">%99.9</div>
                  <div className="text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -z-10 w-[500px] h-[500px] bg-[#F3F0FF] rounded-full blur-3xl opacity-30 -left-20 -top-20" />
              <img
                src="/placeholder.svg"
                alt="Statistics Dashboard"
                className="w-full rounded-2xl shadow-2xl border border-gray-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#6E59A5] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Hemen Ücretsiz Deneyin
          </h2>
          <p className="text-gray-100 mb-8 text-lg">
            14 gün boyunca tüm özellikleri ücretsiz kullanın, kredi kartı gerektirmez.
          </p>
          <Button 
            size="lg"
            className="bg-white text-[#6E59A5] hover:bg-gray-100 h-12 px-8 gap-2"
            onClick={() => setIsTrialFormOpen(true)}
          >
            Hemen Başlayın <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      <TrialForm 
        open={isTrialFormOpen} 
        onOpenChange={setIsTrialFormOpen}
      />
    </div>
  );
}
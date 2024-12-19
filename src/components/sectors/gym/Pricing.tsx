import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function Pricing() {
  return (
    <div className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Şeffaf Fiyatlandırma
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            İhtiyaçlarınıza en uygun paketi seçin, spor salonunuzu müzikle güçlendirin
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <h3 className="text-xl font-bold mb-2">Başlangıç</h3>
            <div className="text-4xl font-bold mb-6">₺499<span className="text-lg text-gray-500">/ay</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-[#6E59A5]" />
                <span>1 Şube Desteği</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-[#6E59A5]" />
                <span>5 Hazır Playlist</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-[#6E59A5]" />
                <span>E-posta Desteği</span>
              </li>
            </ul>
            <Button className="w-full bg-[#6E59A5] hover:bg-[#5A478A] transform hover:scale-105 transition-all">
              Paketi Seçin
            </Button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-xl border-2 border-[#6E59A5] relative animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-[#6E59A5] text-white px-6 py-2 rounded-full text-sm font-semibold">
                En Popüler
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">Profesyonel</h3>
            <div className="text-4xl font-bold mb-6">₺999<span className="text-lg text-gray-500">/ay</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-[#6E59A5]" />
                <span>5 Şube Desteği</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-[#6E59A5]" />
                <span>Sınırsız Playlist</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-[#6E59A5]" />
                <span>7/24 Öncelikli Destek</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-[#6E59A5]" />
                <span>Detaylı Raporlama</span>
              </li>
            </ul>
            <Button className="w-full bg-[#6E59A5] hover:bg-[#5A478A] transform hover:scale-105 transition-all">
              Hemen Başlayın
            </Button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <h3 className="text-xl font-bold mb-2">Kurumsal</h3>
            <div className="text-4xl font-bold mb-6">₺1999<span className="text-lg text-gray-500">/ay</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-[#6E59A5]" />
                <span>Sınırsız Şube</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-[#6E59A5]" />
                <span>API Entegrasyonu</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-[#6E59A5]" />
                <span>VIP Destek</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-[#6E59A5]" />
                <span>Özel Entegrasyonlar</span>
              </li>
            </ul>
            <Button className="w-full bg-[#6E59A5] hover:bg-[#5A478A] transform hover:scale-105 transition-all">
              İletişime Geçin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
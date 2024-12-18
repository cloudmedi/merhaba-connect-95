import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function Pricing() {
  return (
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
  );
}
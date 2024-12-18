import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const PricingSection = () => {
  return (
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
  );
};
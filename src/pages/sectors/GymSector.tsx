import { Play } from "lucide-react";
import { SectorLayout } from "@/components/layout/SectorLayout";
import { Features } from "@/components/sectors/gym/Features";
import { WorkoutAreas } from "@/components/sectors/gym/WorkoutAreas";
import { Pricing } from "@/components/sectors/gym/Pricing";
import { FAQ } from "@/components/sectors/gym/FAQ";

export default function GymSector() {
  return (
    <SectorLayout>
      {/* Hero Section - Without Buttons */}
      <div className="relative h-[600px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2940&auto=format&fit=crop"
          alt="Modern Spor Salonu"
          className="w-full h-full object-cover brightness-50 transform scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20">
          <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-full w-fit mb-6 animate-fade-in-up">
              <Play className="w-4 h-4" />
              <span className="text-sm">14 Gün Ücretsiz Deneme</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up delay-100">
              Spor Salonunuzu<br />
              <span className="text-purple-400">Müzikle Güçlendirin</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mb-8 animate-fade-in-up delay-200">
              Motivasyonu artıran, enerji dolu playlist'ler ile spor salonunuzun atmosferini zirveye taşıyın.
            </p>
          </div>
        </div>
      </div>

      <Features />
      <WorkoutAreas />
      <Pricing />
      <FAQ />

      {/* CTA Section */}
      <div className="bg-[#6E59A5] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 animate-fade-in-up">
            Spor Salonunuzun Müzik İhtiyacını Karşılayalım
          </h2>
          <p className="text-xl mb-8 opacity-90 animate-fade-in-up delay-100">
            14 günlük ücretsiz deneme ile MusicBiz'in spor salonunuza özel müzik çözümlerini keşfedin.
          </p>
          <button 
            className="bg-white text-[#6E59A5] hover:bg-white/90 px-8 py-3 rounded-lg text-lg font-medium transform hover:scale-105 transition-all animate-fade-in-up delay-200"
          >
            Hemen Başlayın
          </button>
        </div>
      </div>
    </SectorLayout>
  );
}
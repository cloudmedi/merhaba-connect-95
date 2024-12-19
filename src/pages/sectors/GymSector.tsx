import { Play } from "lucide-react";
import { SectorLayout } from "@/components/layout/SectorLayout";
import { Features } from "@/components/sectors/gym/Features";
import { WorkoutAreas } from "@/components/sectors/gym/WorkoutAreas";
import { Pricing } from "@/components/sectors/gym/Pricing";
import { FAQ } from "@/components/sectors/gym/FAQ";

export default function GymSector() {
  return (
    <SectorLayout>
      {/* Hero Section */}
      <div className="relative h-[85vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2940&auto=format&fit=crop"
          alt="Modern Spor Salonu"
          className="w-full h-full object-cover brightness-[0.35] transform scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
                Fitness Deneyimini<br />
                <span className="text-purple-300">Müzikle Yükseltin</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-8 leading-relaxed animate-fade-in-up delay-200">
                Profesyonel müzik çözümlerimizle spor salonunuzun atmosferini dönüştürün, üyelerinizin motivasyonunu artırın.
              </p>
              <button 
                className="bg-white hover:bg-white/90 text-[#6E59A5] px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-300 flex items-center gap-2 shadow-lg"
              >
                <Play size={20} />
                Ücretsiz Deneyin
              </button>
            </div>
          </div>
        </div>
      </div>

      <Features />
      <WorkoutAreas />
      <Pricing />
      <FAQ />

      {/* CTA Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#6E59A5]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#6E59A5] to-purple-800" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white animate-fade-in-up">
            Spor Salonunuzu Dönüştürmeye Hazır mısınız?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto animate-fade-in-up delay-100">
            14 günlük ücretsiz deneme ile MusicBiz'in sunduğu premium müzik deneyimini keşfedin.
          </p>
          <button 
            className="bg-white text-[#6E59A5] hover:bg-white/90 px-8 py-4 rounded-lg text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl animate-fade-in-up delay-200"
          >
            Hemen Başlayın
          </button>
        </div>
      </div>
    </SectorLayout>
  );
}
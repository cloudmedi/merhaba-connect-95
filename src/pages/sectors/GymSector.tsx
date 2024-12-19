import { Play } from "lucide-react";
import { SectorLayout } from "@/components/layout/SectorLayout";
import { Features } from "@/components/sectors/gym/Features";
import { WorkoutAreas } from "@/components/sectors/gym/WorkoutAreas";
import { Pricing } from "@/components/sectors/gym/Pricing";
import { FAQ } from "@/components/sectors/gym/FAQ";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TrialForm } from "@/components/landing/TrialForm";

export default function GymSector() {
  const [isTrialFormOpen, setIsTrialFormOpen] = useState(false);

  return (
    <SectorLayout>
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2940&auto=format&fit=crop"
          alt="Modern Spor Salonu"
          className="w-full h-full object-cover brightness-50 transform scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20">
          <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up delay-100">
              Spor Salonunuzun Müzik İhtiyacını Karşılayalım
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8 animate-fade-in-up delay-200">
              14 günlük ücretsiz deneme ile MusicBiz'in spor salonunuza özel müzik çözümlerini keşfedin.
            </p>
            <Button 
              size="lg"
              onClick={() => setIsTrialFormOpen(true)}
              className="bg-white text-[#6E59A5] hover:bg-white/90 px-8 py-6 rounded-lg text-lg font-medium transform hover:scale-105 transition-all animate-fade-in-up delay-200"
            >
              Hemen Başlayın
            </Button>
          </div>
        </div>
      </div>

      <Features />
      <WorkoutAreas />
      <Pricing />
      <FAQ />

      <TrialForm 
        open={isTrialFormOpen} 
        onOpenChange={setIsTrialFormOpen}
      />
    </SectorLayout>
  );
}
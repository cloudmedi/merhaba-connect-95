import { SectorLayout } from "@/components/layout/SectorLayout";
import { Button } from "@/components/ui/button";
import { Play, Check } from "lucide-react";
import { useState } from "react";
import { TrialForm } from "@/components/landing/TrialForm";

export default function GymSector() {
  const [isTrialFormOpen, setIsTrialFormOpen] = useState(false);

  return (
    <SectorLayout>
      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2940&auto=format&fit=crop"
            alt="Modern Gym Interior"
            className="w-full h-full object-cover brightness-[0.35] animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-8 animate-fade-in-up">
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">14 Gün Ücretsiz Deneme</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
              Spor Salonunuzun Atmosferini
              <span className="text-[#9b87f5] block mt-2">
                Müzikle Güçlendirin
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8 leading-relaxed animate-fade-in-up">
              Profesyonel müzik direktörlerimiz tarafından hazırlanan, yüksek enerjili playlist'ler ile üyelerinizin motivasyonunu artırın.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
              <Button
                size="lg"
                className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white px-8 h-12 text-base"
                onClick={() => setIsTrialFormOpen(true)}
              >
                14 Gün Ücretsiz Deneyin
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 h-12 text-base"
              >
                Örnek Playlist'leri İnceleyin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[#F1F0FB] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Spor Salonları İçin Özel Çözümler
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Her bölüm için özel olarak hazırlanmış müzik deneyimi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Cardio Bölümü",
                description: "Yüksek tempolu, motivasyon artırıcı müzikler",
                image: "1534258936925-c58bed479fcb"
              },
              {
                title: "Fitness Stüdyosu",
                description: "Grup dersleri için özel hazırlanmış playlist'ler",
                image: "1518611012118-696072aa579a"
              },
              {
                title: "Serbest Ağırlık",
                description: "Güç antrenmanları için yüksek enerjili şarkılar",
                image: "1534438327276-14e5300c3a48"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48">
                  <img
                    src={`https://images.unsplash.com/photo-${feature.image}?w=800&auto=format&fit=crop&q=60`}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24">
        <div className="absolute inset-0 bg-[#9b87f5]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white animate-fade-in-up">
            Spor Salonunuzu Dönüştürmeye Hazır mısınız?
          </h2>
          <p className="text-xl mb-10 text-white/90 max-w-3xl mx-auto animate-fade-in-up">
            14 günlük ücretsiz deneme ile MusicBiz'in sunduğu premium müzik deneyimini keşfedin.
          </p>
          <Button
            size="lg"
            className="bg-white text-[#7E69AB] hover:bg-white/90 h-12 text-base animate-fade-in-up"
            onClick={() => setIsTrialFormOpen(true)}
          >
            Hemen Başlayın
          </Button>
        </div>
      </div>

      <TrialForm 
        open={isTrialFormOpen} 
        onOpenChange={setIsTrialFormOpen}
      />
    </SectorLayout>
  );
}
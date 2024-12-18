import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { TrialForm } from "./TrialForm";
import { HeroFeatures } from "./HeroFeatures";
import { PlaylistGrid } from "./PlaylistGrid";
import { CallToAction } from "./CallToAction";

export function HeroSection() {
  const navigate = useNavigate();
  const [isTrialFormOpen, setIsTrialFormOpen] = useState(false);
  
  const playlists = [
    {
      title: "CCM Christmas",
      image: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&auto=format&fit=crop&q=60",
      category: "CHRISTMAS"
    },
    {
      title: "Xmas Pop",
      image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&auto=format&fit=crop&q=60",
      category: "CHRISTMAS"
    },
    {
      title: "Pop FM",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60",
      category: "POP"
    },
    {
      title: "Store Christmas",
      image: "https://images.unsplash.com/photo-1512389098783-66b81f86e199?w=800&auto=format&fit=crop&q=60",
      category: "STORE"
    },
    {
      title: "Christmas Party",
      image: "https://images.unsplash.com/photo-1517230878791-4d28214057c2?w=800&auto=format&fit=crop&q=60",
      category: "PARTY"
    },
    {
      title: "Energy Booster",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60",
      category: "HITS"
    },
    {
      title: "Instrumental Christmas",
      image: "https://images.unsplash.com/photo-1511715282680-fbf93a50e721?w=800&auto=format&fit=crop&q=60",
      category: "CHRISTMAS"
    },
    {
      title: "Restaurant Christmas",
      image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&auto=format&fit=crop&q=60",
      category: "RESTAURANT"
    },
    {
      title: "Jingle Bell Rock",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60",
      category: "ROCK"
    },
    {
      title: "Bar Christmas",
      image: "https://images.unsplash.com/photo-1482575832494-771f74bf6857?w=800&auto=format&fit=crop&q=60",
      category: "BAR"
    },
    {
      title: "Family-friendly Pop",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop&q=60",
      category: "POP"
    },
    {
      title: "Most Played Store",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&auto=format&fit=crop&q=60",
      category: "STORE"
    },
  ];
  
  return (
    <div className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-full">
              <Play className="w-4 h-4" />
              <span className="text-sm">14 Gün Ücretsiz Deneme - Kredi Kartı Gerekmez</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
                İşletmenizi{" "}
                <span className="text-[#6E59A5] block mt-2">
                  Müzikle Güçlendirin
                </span>
              </h1>
              <p className="text-gray-600 text-lg max-w-xl">
                Müzik direktörlerimiz tarafından özenle seçilmiş 10.000+ telifsiz şarkıya erişin. Her hafta güncellenen sektöre özel playlist'ler ile müşteri deneyimini zirveye taşıyın.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-[#6E59A5] hover:bg-[#5A478A] text-white px-8"
                onClick={() => setIsTrialFormOpen(true)}
              >
                14 Gün Ücretsiz Deneyin
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-[#6E59A5] text-[#6E59A5] hover:bg-[#6E59A5] hover:text-white"
              >
                Örnek Müzikleri Dinleyin
              </Button>
            </div>

            <HeroFeatures />
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2940&auto=format&fit=crop"
              alt="Modern Cafe İç Mekan"
              className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <CallToAction />
        <PlaylistGrid playlists={playlists} />
      </div>

      <TrialForm 
        open={isTrialFormOpen} 
        onOpenChange={setIsTrialFormOpen}
      />
    </div>
  );
}

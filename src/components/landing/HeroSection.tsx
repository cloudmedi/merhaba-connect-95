import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { TrialForm } from "./TrialForm";

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

            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#6E59A5]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </div>
                <span className="text-gray-700">10.000+ Şarkı</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#6E59A5]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </div>
                <span className="text-gray-700">Haftalık Güncellemeler</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#6E59A5]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </div>
                <span className="text-gray-700">Sektöre Özel</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#6E59A5]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </div>
                <span className="text-gray-700">7/24 Destek</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2940&auto=format&fit=crop"
              alt="Modern Cafe İç Mekan"
              className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Spor Salonunuzun Müzik İhtiyacını Karşılayalım
          </h2>
          <p className="text-gray-600 mb-8">
            14 günlük ücretsiz deneme ile MusicBiz'in spor salonunuza özel müzik çözümlerini keşfedin.
          </p>
          <Button 
            size="lg"
            className="bg-[#6E59A5] hover:bg-[#5A478A] text-white"
          >
            Ücretsiz Deneyin
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist, index) => (
            <div key={index} className="relative group cursor-pointer">
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={playlist.image}
                  alt={playlist.title}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">{playlist.category}</p>
                <h3 className="font-medium text-gray-900">{playlist.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TrialForm 
        open={isTrialFormOpen} 
        onOpenChange={setIsTrialFormOpen}
      />
    </div>
  );
}

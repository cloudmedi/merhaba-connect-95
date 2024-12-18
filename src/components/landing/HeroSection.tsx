import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <div className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Free Trial Badge */}
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-full">
              <Play className="w-4 h-4" />
              <span className="text-sm">14 Gün Ücretsiz Deneme - Kredi Kartı Gerekmez</span>
            </div>

            {/* Hero Content */}
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

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-[#6E59A5] hover:bg-[#5A478A] text-white px-8"
                onClick={() => navigate("/manager/register")}
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

            {/* Features List */}
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

          {/* Hero Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1559070169-a3077159ee16?q=80&w=2940&auto=format&fit=crop"
              alt="Cafe İç Mekan"
              className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              İşletmenizi<br />
              <span className="text-[#6E59A5]">Mükemmel Müzik</span><br />
              ile Yükseltin
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Tüm şubelerinizin müzik sistemini tek platformdan yönetin. 
              Profesyonel müzik yönetimi ile müşterilerinize unutulmaz deneyimler yaşatın.
            </p>
            <div className="flex gap-4">
              <Button 
                size="lg"
                className="bg-[#6E59A5] hover:bg-[#5A478A]"
                onClick={() => navigate("/manager/register")}
              >
                Hemen Başlayın
              </Button>
              <Button 
                size="lg"
                variant="outline"
              >
                Demo İsteyin
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2940&auto=format&fit=crop"
              alt="Müzik Yönetimi"
              className="rounded-lg shadow-xl w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
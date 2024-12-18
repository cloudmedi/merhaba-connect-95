import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          İşletmenizin Müzik Yönetimi<br />Artık Daha Kolay
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Tüm şubelerinizin müzik ve duyuru sistemini tek platformdan yönetin.
          Profesyonel müzik yönetim çözümü ile işletmenizi bir adım öne taşıyın.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => navigate("/manager/register")}
            className="bg-[#6E59A5] hover:bg-[#5A478A]"
          >
            Hemen Başlayın
          </Button>
          <Button 
            size="lg"
            variant="outline"
          >
            Demo Talep Et
          </Button>
        </div>
      </div>
    </div>
  );
};
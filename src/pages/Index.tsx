import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Music2, Radio, Headphones } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Müzik Yönetim Platformu
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Şubeleriniz için müzik yayınını kolayca yönetin, planlayın ve kontrol edin.
          </p>
          <div className="flex justify-center gap-4">
            {user ? (
              <Button
                onClick={() => navigate("/manager")}
                className="bg-[#6366F1] hover:bg-[#5558DD] text-white px-8 py-6 rounded-full text-lg"
              >
                Yönetim Paneline Git
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/manager/login")}
                className="bg-[#6366F1] hover:bg-[#5558DD] text-white px-8 py-6 rounded-full text-lg"
              >
                Giriş Yap
              </Button>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music2 className="w-8 h-8 text-[#6366F1]" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Müzik Yönetimi</h3>
            <p className="text-gray-600">
              Tüm şubeleriniz için müzik listelerini merkezi olarak yönetin ve organize edin.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Radio className="w-8 h-8 text-[#6366F1]" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Canlı Kontrol</h3>
            <p className="text-gray-600">
              Şubelerinizdeki müzik sistemlerini gerçek zamanlı olarak izleyin ve kontrol edin.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Headphones className="w-8 h-8 text-[#6366F1]" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Çevrimdışı Oynatma</h3>
            <p className="text-gray-600">
              İnternet bağlantısı olmadan da kesintisiz müzik yayını için çevrimdışı oynatma desteği.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
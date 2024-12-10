import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Music2, 
  Calendar, 
  Bell, 
  Settings, 
  Building2,
  PlayCircle,
  BarChart3,
  Headphones,
  Speaker,
  Clock,
  Shield,
  Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Sector {
  id: string;
  name: string;
}

export default function Landing() {
  const navigate = useNavigate();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSectors = async () => {
      const { data } = await supabase.from('sectors').select('*');
      if (data) setSectors(data);
    };
    fetchSectors();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      company_name: formData.get('company_name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      branch_count: Number(formData.get('branch_count')),
      sector_id: formData.get('sector_id'),
      message: formData.get('message'),
      full_name: formData.get('full_name')
    };

    try {
      const { error } = await supabase.from('leads').insert([data]);
      if (error) throw error;
      
      toast.success("Başvurunuz başarıyla alındı. En kısa sürede size ulaşacağız.");
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              İşletmeniz İçin Profesyonel Müzik Çözümü
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Tek platformdan tüm şubelerinizin müzik sistemini yönetin. 
              Markanıza özel müzik deneyimi oluşturun.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate("/manager")}
                className="bg-white text-purple-900 hover:bg-purple-50"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Hemen Başlayın
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10"
                onClick={() => {
                  const demoForm = document.getElementById('demo-form');
                  demoForm?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Headphones className="mr-2 h-5 w-5" />
                Demo İsteyin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Kapsamlı Yönetim Özellikleri
          </h2>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            İşletmenizin müzik sistemini yönetmek için ihtiyacınız olan her şey tek platformda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Playlist Yönetimi",
              description: "Kategorilere, ruh haline ve türlere göre müzik listelerini kolayca oluşturun ve yönetin.",
              icon: Music2,
              color: "text-purple-300",
              bgColor: "bg-purple-800/50"
            },
            {
              title: "Zaman Planlaması",
              description: "Farklı zaman dilimleri için otomatik müzik programları oluşturun.",
              icon: Calendar,
              color: "text-blue-300",
              bgColor: "bg-blue-800/50"
            },
            {
              title: "Cihaz Yönetimi",
              description: "Tüm müzik cihazlarınızı tek bir merkezden kontrol edin ve izleyin.",
              icon: Speaker,
              color: "text-emerald-300",
              bgColor: "bg-emerald-800/50"
            },
            {
              title: "Anonslar",
              description: "Şarkılar arasında veya belirli zamanlarda çalacak anonsları yönetin.",
              icon: Bell,
              color: "text-amber-300",
              bgColor: "bg-amber-800/50"
            },
            {
              title: "Gerçek Zamanlı Analitik",
              description: "Çalma sayıları, popüler şarkılar ve cihaz performans metriklerini takip edin.",
              icon: BarChart3,
              color: "text-indigo-300",
              bgColor: "bg-indigo-800/50"
            },
            {
              title: "Çoklu Şube Desteği",
              description: "Tüm şubelerinizi şube özelinde ayarlarla yönetin.",
              icon: Building2,
              color: "text-rose-300",
              bgColor: "bg-rose-800/50"
            }
          ].map((feature, index) => (
            <Card key={index} className="border-none bg-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-100">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Demo Form Section */}
      <div id="demo-form" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Card className="border-none bg-white/10 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Demo İsteyin
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-purple-100 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    required
                    type="text"
                    name="full_name"
                    className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-md text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ad Soyad"
                  />
                </div>
                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-purple-100 mb-2">
                    Şirket Adı
                  </label>
                  <input
                    required
                    type="text"
                    name="company_name"
                    className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-md text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Şirket Adı"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-purple-100 mb-2">
                    E-posta
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-md text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="E-posta"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-purple-100 mb-2">
                    Telefon
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-md text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Telefon"
                  />
                </div>
                <div>
                  <label htmlFor="branch_count" className="block text-sm font-medium text-purple-100 mb-2">
                    Şube Sayısı
                  </label>
                  <input
                    required
                    type="number"
                    name="branch_count"
                    min="1"
                    className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-md text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Şube Sayısı"
                  />
                </div>
                <div>
                  <label htmlFor="sector_id" className="block text-sm font-medium text-purple-100 mb-2">
                    Sektör
                  </label>
                  <select
                    required
                    name="sector_id"
                    className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Sektör Seçin</option>
                    {sectors.map((sector) => (
                      <option key={sector.id} value={sector.id} className="text-gray-900">
                        {sector.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-purple-100 mb-2">
                  Mesaj
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full px-4 py-2 bg-white/5 border border-purple-300/20 rounded-md text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Mesajınız..."
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-white text-purple-900 hover:bg-purple-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Gönderiliyor..." : "Demo Talebi Oluştur"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Trust Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            Neden Bizi Tercih Etmelisiniz?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Güvenilir</h3>
              <p className="text-purple-100">7/24 teknik destek ve %99.9 çalışma süresi garantisi</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Hızlı</h3>
              <p className="text-purple-100">Kolay kurulum ve hızlı başlangıç süreci</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Profesyonel</h3>
              <p className="text-purple-100">Uzman ekip ve profesyonel destek</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
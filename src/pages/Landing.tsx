import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PlaylistGrid } from "@/components/landing/PlaylistGrid";
import { 
  Music2, 
  Calendar, 
  Bell, 
  Monitor, 
  BarChart3, 
  Building2,
  PlayCircle,
  Users
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sektörleri getir
  const { data: sectors } = useQuery({
    queryKey: ['sectors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Hero playlistleri getir
  const { data: playlists } = useQuery({
    queryKey: ['hero-playlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('is_catalog', true)
        .limit(8);
      if (error) throw error;
      return data;
    }
  });

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      const { error } = await supabase.from('leads').insert({
        full_name: formData.get('fullName'),
        company_name: formData.get('companyName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        branch_count: parseInt(formData.get('branchCount') as string),
        sector_id: formData.get('sectorId'),
        message: formData.get('message')
      });

      if (error) throw error;

      toast.success('Kaydınız başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.');
      setIsRegisterOpen(false);
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const features = [
    {
      title: "Playlist Yönetimi",
      description: "Müzik listelerinizi kolayca oluşturun, düzenleyin ve yönetin. Şarkıları türe, ruh haline ve kategorilere göre organize edin.",
      icon: Music2,
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    },
    {
      title: "Zamanlama Kontrolü",
      description: "Farklı zaman ve lokasyonlar için müzik çalma planları oluşturun. Tekrarlayan programlar ayarlayın.",
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      title: "Cihaz Yönetimi",
      description: "Tüm müzik cihazlarınızı tek bir merkezden izleyin ve kontrol edin.",
      icon: Monitor,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100"
    },
    {
      title: "Duyuru Sistemi",
      description: "Şarkılar arasında veya programlı zamanlarda çalacak duyurular oluşturun ve yönetin.",
      icon: Bell,
      color: "text-amber-500",
      bgColor: "bg-amber-100"
    },
    {
      title: "Gerçek Zamanlı Analitikler",
      description: "Çalma sayılarını, popüler şarkıları ve cihaz performans metriklerini takip edin.",
      icon: BarChart3,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100"
    },
    {
      title: "Çoklu Şube Desteği",
      description: "Birden fazla lokasyondaki müzik sistemini, şubeye özel ayarlarla yönetin.",
      icon: Building2,
      color: "text-rose-500",
      bgColor: "bg-rose-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Profesyonel Müzik Yönetim Sistemi
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              İşletmenizin müzik ekosistemini tek bir platformdan kontrol edin.
              Tüm lokasyonlarınızdaki müziği planlayın, yönetin ve takip edin.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate("/manager")}
                className="bg-[#6E59A5] hover:bg-[#5A478A]"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Yönetim Paneli
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => setIsRegisterOpen(true)}
              >
                <Users className="mr-2 h-5 w-5" />
                Hemen Başvur
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Preview Section */}
      {playlists && playlists.length > 0 && (
        <PlaylistGrid
          playlists={playlists}
          currentPlayingId={currentPlayingId}
          isPlaying={isPlaying}
          onPlay={(playlist) => {
            setCurrentPlayingId(playlist.id);
            setIsPlaying(!isPlaying);
          }}
        />
      )}

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Kapsamlı Yönetim Özellikleri
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            İşletmenizin müzik sistemini yönetmek için ihtiyacınız olan her şey tek bir yerde
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#6E59A5] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              İşletmenizin Müziğini Dönüştürmeye Hazır mısınız?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Platformumuzu kullanan binlerce işletmeye katılın ve müşterileriniz için mükemmel atmosferi yaratın.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => setIsRegisterOpen(true)}
              className="bg-white text-[#6E59A5] hover:bg-gray-100"
            >
              Hemen Başlayın
            </Button>
          </div>
        </div>
      </div>

      {/* Register Dialog */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Başvuru Formu</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Ad Soyad</label>
              <Input name="fullName" required placeholder="Ad Soyad" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Şirket Adı</label>
              <Input name="companyName" required placeholder="Şirket Adı" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input name="email" type="email" required placeholder="Email" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Telefon</label>
              <Input name="phone" required placeholder="Telefon" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Şube Sayısı</label>
              <Input name="branchCount" type="number" min="1" required placeholder="Şube Sayısı" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Sektör</label>
              <Select name="sectorId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Sektör seçin" />
                </SelectTrigger>
                <SelectContent>
                  {sectors?.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Mesaj</label>
              <Textarea name="message" placeholder="Mesajınız (opsiyonel)" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)}>
                İptal
              </Button>
              <Button type="submit" className="bg-[#6E59A5] hover:bg-[#5A478A]">
                Gönder
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
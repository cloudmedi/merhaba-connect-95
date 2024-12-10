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
import { AudioPreview } from "@/components/landing/AudioPreview";
import { PlayCircle, Users } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const { data: playlists } = useQuery({
    queryKey: ['hero-playlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_songs (
            position,
            songs (
              id,
              title,
              artist,
              file_url,
              bunny_id
            )
          )
        `)
        .eq('is_catalog', true)
        .limit(8);
      
      if (error) throw error;

      // Şarkı URL'lerini düzenle
      return data.map(playlist => ({
        ...playlist,
        songs: playlist.playlist_songs
          .sort((a, b) => a.position - b.position)
          .map(ps => ({
            ...ps.songs,
            file_url: ps.songs.bunny_id 
              ? `https://cloud-media.b-cdn.net/${ps.songs.bunny_id}`
              : ps.songs.file_url
          }))
      }));
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

  const handlePlaylistPlay = (playlist: any) => {
    if (currentPlayingId === playlist.id) {
      setIsPlaying(false);
      setCurrentPlayingId(null);
    } else {
      setCurrentPlayingId(playlist.id);
      setIsPlaying(true);
    }
  };

  const handlePreviewEnd = () => {
    setIsPlaying(false);
    setCurrentPlayingId(null);
    setIsRegisterOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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

      {playlists && playlists.length > 0 && (
        <>
          <PlaylistGrid
            playlists={playlists}
            currentPlayingId={currentPlayingId}
            isPlaying={isPlaying}
            onPlay={handlePlaylistPlay}
          />
          {currentPlayingId && isPlaying && (
            <AudioPreview
              playlist={playlists.find(p => p.id === currentPlayingId)}
              onPreviewEnd={handlePreviewEnd}
            />
          )}
        </>
      )}

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
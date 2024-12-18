import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectorLayout } from "@/components/layout/SectorLayout";
import { Dumbbell, Users, Clock, Sparkles } from "lucide-react";

export default function GymSector() {
  return (
    <SectorLayout>
      <div className="relative h-[600px]">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2940&auto=format&fit=crop"
          alt="Modern Spor Salonu"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20">
          <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Spor Salonu Müzik Çözümleri
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Motivasyonu artıran, enerji dolu playlist'ler ile spor salonunuzun atmosferini zirveye taşıyın.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                <Dumbbell className="h-6 w-6 text-[#6E59A5]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fitness Odaklı</h3>
              <p className="text-gray-600">
                Farklı egzersiz türlerine uygun, tempolu ve motive edici müzik seçkileri
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#6E59A5]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Grup Dersleri</h3>
              <p className="text-gray-600">
                Yoga, pilates ve grup egzersizleri için özel hazırlanmış playlist'ler
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-[#6E59A5]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gün Boyu Enerji</h3>
              <p className="text-gray-600">
                Sabahtan akşama, farklı yoğunluktaki saatlere özel müzik programları
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-[#6E59A5]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Özel Temalar</h3>
              <p className="text-gray-600">
                Sezona özel ve tematik playlist'ler ile farklı deneyimler yaratın
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Spor Salonunuz İçin Özel Müzik Deneyimi
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Profesyonel müzik direktörlerimiz tarafından özenle seçilen playlist'ler ile spor salonunuzun atmosferini güçlendirin. Her bölüm için ayrı ayrı hazırlanan müzik programları ile üyelerinizin motivasyonunu artırın.
              </p>
              <p>
                Cardio alanından serbest ağırlık bölümüne, grup derslerinden fonksiyonel antrenman alanlarına kadar her bölüm için optimize edilmiş müzik akışı ile spor deneyimini zirveye taşıyın.
              </p>
            </div>
            <div className="mt-8">
              <Button 
                size="lg"
                className="bg-[#6E59A5] hover:bg-[#5A478A] text-white"
              >
                Hemen Deneyin
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2940&auto=format&fit=crop"
              alt="Spor Salonu İç Mekan"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
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
        </div>
      </div>
    </SectorLayout>
  );
}
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectorLayout } from "@/components/layout/SectorLayout";
import { Dumbbell, Users, Clock, Sparkles } from "lucide-react";
import { useState } from "react";
import { TrialForm } from "@/components/landing/TrialForm";

export default function GymSector() {
  const [isTrialFormOpen, setIsTrialFormOpen] = useState(false);

  return (
    <SectorLayout>
      {/* Hero Section with Gradient */}
      <div className="relative min-h-screen">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2940&auto=format&fit=crop"
            alt="Modern Spor Salonu"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-purple-600/80" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-64">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Spor Salonunuzu Müzikle Güçlendirin
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Profesyonel müzik direktörlerimiz tarafından seçilen, motivasyonu artıran playlist'ler ile spor salonunuzun atmosferini zirveye taşıyın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => setIsTrialFormOpen(true)}
                className="bg-white text-purple-900 hover:bg-purple-50"
              >
                14 Gün Ücretsiz Deneyin
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Örnek Playlist'leri İnceleyin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="relative -mt-32 pb-20 bg-gradient-to-b from-purple-900 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white/95 backdrop-blur border-none shadow-xl">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <Dumbbell className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fitness Odaklı</h3>
                <p className="text-gray-600">
                  Farklı egzersiz türlerine uygun, tempolu ve motive edici müzik seçkileri
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur border-none shadow-xl">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Grup Dersleri</h3>
                <p className="text-gray-600">
                  Yoga, pilates ve grup egzersizleri için özel hazırlanmış playlist'ler
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur border-none shadow-xl">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Gün Boyu Enerji</h3>
                <p className="text-gray-600">
                  Sabahtan akşama, farklı yoğunluktaki saatlere özel müzik programları
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur border-none shadow-xl">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Özel Temalar</h3>
                <p className="text-gray-600">
                  Sezona özel ve tematik playlist'ler ile farklı deneyimler yaratın
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Spor Salonunuz İçin Profesyonel Müzik Çözümü
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
                  onClick={() => setIsTrialFormOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
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
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-purple-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Spor Salonunuzun Müzik İhtiyacını Karşılayalım
            </h2>
            <p className="text-gray-600 mb-8">
              14 günlük ücretsiz deneme ile MusicBiz'in spor salonunuza özel müzik çözümlerini keşfedin.
            </p>
            <Button 
              size="lg"
              onClick={() => setIsTrialFormOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Ücretsiz Deneyin
            </Button>
          </div>
        </div>
      </div>

      <TrialForm 
        open={isTrialFormOpen} 
        onOpenChange={setIsTrialFormOpen}
      />
    </SectorLayout>
  );
}
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Volume2, Music2, Calendar, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectorLayout } from "@/components/layout/SectorLayout";

export default function GymSector() {
  const testimonials = [
    {
      name: "Ahmet Yılmaz",
      role: "Spor Salonu Sahibi",
      content: "MusicBiz ile spor salonumun atmosferi tamamen değişti! Müşterilerim müzikten çok memnun.",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      name: "Elif Demir",
      role: "Spor Salonu Yöneticisi",
      content: "Müzik yönetimi çok kolay! Artık her antrenman için doğru müziği seçebiliyoruz.",
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      name: "Mehmet Can",
      role: "Fitness Eğitmeni",
      content: "Müzik motivasyonumuzu artırıyor. MusicBiz sayesinde antrenmanlar daha eğlenceli hale geldi.",
      image: "https://randomuser.me/api/portraits/men/2.jpg"
    }
  ];

  const features = [
    {
      title: "Özel Playlist'ler",
      description: "Her antrenman için özel olarak hazırlanmış playlist'ler.",
      icon: Music2
    },
    {
      title: "Gerçek Zamanlı İzleme",
      description: "Müzik akışını anlık olarak takip edin.",
      icon: Volume2
    },
    {
      title: "Programlama",
      description: "Müzik akışını haftalık olarak programlayın.",
      icon: Calendar
    },
    {
      title: "Etkileşimli Deneyim",
      description: "Müşterilerinizle etkileşimde bulunun.",
      icon: Clock
    }
  ];

  return (
    <SectorLayout>
      {/* Hero Section */}
      <div className="relative h-[600px]">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2940&auto=format&fit=crop"
          alt="Modern Spor Salonu"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20">
          <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-full w-fit mb-6">
              <Play className="w-4 h-4" />
              <span className="text-sm">14 Gün Ücretsiz Deneme</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Spor Salonunuzu<br />
              <span className="text-purple-400">Müzikle Güçlendirin</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mb-8">
              Motivasyonu artıran, enerji dolu playlist'ler ile spor salonunuzun atmosferini zirveye taşıyın.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-[#6E59A5] hover:bg-[#5A478A]">
                Hemen Deneyin
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Detaylı Bilgi Alın
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-[#6E59A5]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs defaultValue="cardio" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-8">
              <TabsTrigger value="cardio">Cardio Bölümü</TabsTrigger>
              <TabsTrigger value="weights">Serbest Ağırlık</TabsTrigger>
              <TabsTrigger value="classes">Grup Dersleri</TabsTrigger>
              <TabsTrigger value="functional">Fonksiyonel</TabsTrigger>
            </TabsList>
            {["cardio", "weights", "classes", "functional"].map((area) => (
              <TabsContent key={area} value={area} className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      {area === "cardio" && "Cardio Bölümü İçin Özel Müzik"}
                      {area === "weights" && "Serbest Ağırlık Alanı"}
                      {area === "classes" && "Grup Dersleri"}
                      {area === "functional" && "Fonksiyonel Antrenman"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Her bölüm için özel olarak seçilmiş müzikler ile antrenman verimini artırın.
                    </p>
                    <Button className="bg-[#6E59A5] hover:bg-[#5A478A]">
                      Playlist'leri İnceleyin
                    </Button>
                  </div>
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-${
                        area === "cardio" ? "1534258936925-c58bed479fcb" :
                        area === "weights" ? "1534438327276-14e5300c3a48" :
                        area === "classes" ? "1518611012118-696072aa579a" :
                        "1518310383802-640c2de311b2"
                      }?w=800&auto=format&fit=crop&q=60`}
                      alt={`${area} Bölümü`}
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Spor Salonu Sahipleri Ne Diyor?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#6E59A5] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Spor Salonunuzun Müzik İhtiyacını Karşılayalım
          </h2>
          <p className="text-xl mb-8 opacity-90">
            14 günlük ücretsiz deneme ile MusicBiz'in spor salonunuza özel müzik çözümlerini keşfedin.
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-white border-white hover:bg-white hover:text-[#6E59A5] px-8 py-6 text-lg font-medium"
          >
            Hemen Başlayın
          </Button>
        </div>
      </div>
    </SectorLayout>
  );
}
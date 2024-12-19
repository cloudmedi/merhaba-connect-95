import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const areas = [
  {
    id: "cardio",
    title: "Cardio Bölümü",
    description: "Yüksek enerjili cardio antrenmanları için özel seçilmiş dinamik playlist'ler. Koşu bandı, eliptik bisiklet ve diğer kardiyovasküler ekipmanlar için tempolu ve motive edici müzik seçkileri ile üyelerinizin performansını artırın. Her yaş ve fitness seviyesine uygun, kalp atış hızını optimize eden ritimler.",
    image: "1534258936925-c58bed479fcb"
  },
  {
    id: "weights",
    title: "Serbest Ağırlık",
    description: "Güç antrenmanlarınız için motivasyon yükseltici müzik seçkileri. Bench press, squat, deadlift ve diğer temel egzersizler için özel hazırlanmış, yüksek enerjili şarkılar. Ağır kaldırma setleri arasında dinlenme ve yenilenme için tempolu geçişler içeren profesyonel playlist'ler.",
    image: "1534438327276-14e5300c3a48"
  },
  {
    id: "classes",
    title: "Grup Dersleri",
    description: "Her grup dersi için özel hazırlanmış, senkronize edilmiş playlist'ler. Yoga'dan HIIT'e, Pilates'ten Zumba'ya kadar tüm grup egzersizleri için özel olarak seçilmiş müzikler. Dersin yoğunluğuna ve ritmine göre ayarlanmış, eğitmenlerinizin kolayca takip edebileceği akışlar.",
    image: "1518611012118-696072aa579a"
  },
  {
    id: "functional",
    title: "Fonksiyonel",
    description: "HIIT ve fonksiyonel antrenmanlar için tempolu müzik seçenekleri. CrossFit tarzı yüksek yoğunluklu antrenmanlar için özel hazırlanmış, interval yapısına uygun playlist'ler. Burpees, box jumps ve battle ropes gibi dinamik hareketler için motive edici müzik seçkileri.",
    image: "1518310383802-640c2de311b2"
  }
];

export function WorkoutAreas() {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    // Her 5 saniyede bir sonraki slide'a geç
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    // Component unmount olduğunda interval'i temizle
    return () => {
      clearInterval(interval);
      api.off("select");
    };
  }, [api]);

  return (
    <div className="bg-[#F1F0FB] py-20">
      <div className="max-w-7xl mx-auto px-4">
        <Carousel 
          setApi={setApi}
          className="w-full"
          opts={{
            align: "start",
            loop: true
          }}
        >
          <CarouselContent>
            {areas.map((area) => (
              <CarouselItem key={area.id}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6 animate-fade-in-up">
                    <h3 className="text-2xl font-bold">{area.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{area.description}</p>
                  </div>
                  <div className="relative rounded-xl overflow-hidden shadow-xl">
                    <img
                      src={`https://images.unsplash.com/photo-${area.image}?w=800&auto=format&fit=crop&q=60`}
                      alt={area.title}
                      className="w-full aspect-video object-cover transform hover:scale-110 transition-all duration-700"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Slide indikatörleri */}
        <div className="flex justify-center gap-2 mt-8">
          {areas.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                current === index ? "bg-[#6E59A5] w-6" : "bg-gray-300"
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
import { Card, CardContent } from "@/components/ui/card";
import { Music2, Volume2, Calendar, Clock } from "lucide-react";

const features = [
  {
    title: "Özelleştirilmiş Müzik Yönetimi",
    description: "Sektör uzmanlarımız tarafından hazırlanan, spor salonunuza özel playlist'ler ile üyelerinizin motivasyonunu artırın.",
    icon: Music2
  },
  {
    title: "Merkezi Kontrol Sistemi",
    description: "Tüm şubelerinizin müzik akışını tek bir platformdan yönetin, zamandan ve enerjiden tasarruf edin.",
    icon: Volume2
  },
  {
    title: "Akıllı Programlama",
    description: "Yoğunluk ve saat dilimine göre otomatik müzik seçimi yapan yapay zeka destekli sistemimizle işlerinizi kolaylaştırın.",
    icon: Calendar
  },
  {
    title: "7/24 Teknik Destek",
    description: "Uzman ekibimizden kesintisiz teknik destek ve müzik danışmanlığı hizmeti alın, sorunsuz bir deneyim yaşayın.",
    icon: Clock
  }
];

export function Features() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Premium Spor Salonu Çözümleri
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Modern spor salonları için özel olarak tasarlanmış, kullanımı kolay müzik yönetim sistemi
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="pt-6">
              <div className="rounded-full w-14 h-14 bg-purple-50 flex items-center justify-center mb-6">
                <feature.icon className="h-7 w-7 text-[#6E59A5]" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
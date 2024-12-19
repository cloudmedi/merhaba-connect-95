import { Card, CardContent } from "@/components/ui/card";
import { Music2, Volume2, Calendar, Clock, ChevronDown } from "lucide-react";

const features = [
  {
    title: "Profesyonel Müzik Yönetimi",
    description: "Sektör uzmanları tarafından hazırlanan özel playlist'ler",
    icon: Music2
  },
  {
    title: "Gerçek Zamanlı Kontrol",
    description: "Tüm şubelerinizin müzik akışını tek noktadan yönetin",
    icon: Volume2
  },
  {
    title: "Akıllı Programlama",
    description: "Günün saatine ve yoğunluğa göre otomatik müzik seçimi",
    icon: Calendar
  },
  {
    title: "Kesintisiz Destek",
    description: "7/24 teknik destek ve müzik danışmanlığı",
    icon: Clock
  }
];

export function Features() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Spor Salonunuz İçin Profesyonel Çözümler
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Modern spor salonları için özel olarak tasarlanmış müzik yönetim sistemi
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="border-none shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-[#F1F0FB] flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-[#6E59A5]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
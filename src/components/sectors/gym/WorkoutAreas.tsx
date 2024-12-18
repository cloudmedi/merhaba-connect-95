import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const areas = [
  {
    id: "cardio",
    title: "Cardio Bölümü",
    description: "Yüksek enerjili cardio antrenmanları için özel seçilmiş dinamik playlist'ler",
    image: "1534258936925-c58bed479fcb"
  },
  {
    id: "weights",
    title: "Serbest Ağırlık",
    description: "Güç antrenmanlarınız için motivasyon yükseltici müzik seçkileri",
    image: "1534438327276-14e5300c3a48"
  },
  {
    id: "classes",
    title: "Grup Dersleri",
    description: "Her grup dersi için özel hazırlanmış, senkronize edilmiş playlist'ler",
    image: "1518611012118-696072aa579a"
  },
  {
    id: "functional",
    title: "Fonksiyonel",
    description: "HIIT ve fonksiyonel antrenmanlar için tempolu müzik seçenekleri",
    image: "1518310383802-640c2de311b2"
  }
];

export function WorkoutAreas() {
  return (
    <div className="bg-[#F1F0FB] py-20">
      <div className="max-w-7xl mx-auto px-4">
        <Tabs defaultValue="cardio" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-8 bg-white/50 p-1 rounded-lg">
            {areas.map((area) => (
              <TabsTrigger 
                key={area.id} 
                value={area.id}
                className="data-[state=active]:bg-[#6E59A5] data-[state=active]:text-white"
              >
                {area.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {areas.map((area) => (
            <TabsContent key={area.id} value={area.id} className="mt-8 animate-fade-in-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">{area.title}</h3>
                  <p className="text-gray-600 mb-6">{area.description}</p>
                  <Button className="bg-[#6E59A5] hover:bg-[#5A478A] transform hover:scale-105 transition-all">
                    Playlist'leri İnceleyin
                  </Button>
                </div>
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  <img
                    src={`https://images.unsplash.com/photo-${area.image}?w=800&auto=format&fit=crop&q=60`}
                    alt={area.title}
                    className="w-full aspect-video object-cover transform hover:scale-110 transition-all duration-700"
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
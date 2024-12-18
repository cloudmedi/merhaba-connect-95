import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4">
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
  );
}
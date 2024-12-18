import { Music, Building2, Calendar, Activity } from "lucide-react";

export const FeaturesGrid = () => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Öne Çıkan Özellikler
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            İşletmenizin müzik yönetimini kolaylaştıran profesyonel çözümler
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Music className="h-8 w-8 text-[#6E59A5] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Merkezi Müzik Yönetimi</h3>
            <p className="text-gray-600">Tüm playlist'lerinizi tek noktadan yönetin</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Building2 className="h-8 w-8 text-[#6E59A5] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Çoklu Şube Kontrolü</h3>
            <p className="text-gray-600">Farklı lokasyonlar için özelleştirilmiş müzik akışı</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Calendar className="h-8 w-8 text-[#6E59A5] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Akıllı Programlama</h3>
            <p className="text-gray-600">Otomatik müzik ve duyuru programlama</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Activity className="h-8 w-8 text-[#6E59A5] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Gerçek Zamanlı İzleme</h3>
            <p className="text-gray-600">Cihaz durumlarını anlık takip edin</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export function WeeklyPlaylists() {
  return (
    <div className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Haftalık Özel Playlist'ler
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            İşletmeniz için özenle seçilmiş playlist'ler ile müşterilerinize en iyi deneyimi yaşatın
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-square bg-gray-100 animate-pulse" />
              <div className="p-4">
                <div className="h-4 bg-gray-100 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
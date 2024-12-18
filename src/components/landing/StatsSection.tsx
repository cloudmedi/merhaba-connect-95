export const StatsSection = () => {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-[#6E59A5] mb-2">500+</div>
            <div className="text-gray-600">Aktif İşletme</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#6E59A5] mb-2">1000+</div>
            <div className="text-gray-600">Toplam Şube</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#6E59A5] mb-2">5000+</div>
            <div className="text-gray-600">Aktif Playlist</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#6E59A5] mb-2">50K+</div>
            <div className="text-gray-600">Toplam Müzik</div>
          </div>
        </div>
      </div>
    </div>
  );
};
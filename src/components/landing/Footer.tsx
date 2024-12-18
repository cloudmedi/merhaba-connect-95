export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-4">Merhaba Connect</h4>
            <p className="text-gray-600 text-sm">
              Profesyonel müzik yönetim çözümü ile işletmenizi bir adım öne taşıyın.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Ürün</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Özellikler</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Fiyatlandırma</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Demo</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Şirket</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Hakkımızda</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">İletişim</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Destek</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Yardım Merkezi</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Dokümantasyon</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Status</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 Merhaba Connect. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};
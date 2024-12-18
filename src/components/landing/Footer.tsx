import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Şirket</h3>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Hakkımızda
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Kariyer
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Blog
                </Button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Özellikler</h3>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Merkezi Yönetim
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Akıllı Programlama
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Gerçek Zamanlı İzleme
                </Button>
              </li>
            </ul>
          </div>

          {/* Uygulamalar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Uygulamalar</h3>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  iOS Uygulaması
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Android Uygulaması
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Web Uygulaması
                </Button>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ürünler</h3>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Müzik Yönetimi
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Duyuru Sistemi
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                  Cihaz Takibi
                </Button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">İletişim</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4" />
                info@musicforbusiness.com
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4" />
                +90 (212) 123 45 67
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                İstanbul, Türkiye
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sosyal Medya</h3>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Music For Business. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Button variant="link" className="text-gray-400 hover:text-white text-sm p-0 h-auto">
                Gizlilik Politikası
              </Button>
              <Button variant="link" className="text-gray-400 hover:text-white text-sm p-0 h-auto">
                Kullanım Şartları
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
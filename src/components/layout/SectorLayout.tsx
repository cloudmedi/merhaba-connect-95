import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SectorLayoutProps {
  children: React.ReactNode;
}

export function SectorLayout({ children }: SectorLayoutProps) {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Button
              variant="ghost"
              className="text-gray-600 gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Geri Dön
            </Button>
          </div>
        </div>
      </nav>
      
      {children}
      
      <Footer />
    </div>
  );
}
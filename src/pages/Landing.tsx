import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { WeeklyPlaylists } from "@/components/landing/WeeklyPlaylists";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { useState } from "react";
import { TrialForm } from "@/components/landing/TrialForm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const sectors = [
  "Kafe & Restoran",
  "Spor Salonu",
  "Güzellik & SPA",
  "Mağaza",
  "Otel",
  "AVM",
  "Ofis",
  "Diğer"
];

export default function Landing() {
  const navigate = useNavigate();
  const [isTrialFormOpen, setIsTrialFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                className="text-gray-600 gap-2"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4" />
                MusicBiz
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-gray-600 font-medium"
                  >
                    Sektörler
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 shadow-lg rounded-xl border-none bg-white">
                  <div className="grid gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Sektörünüzü Seçin</h3>
                    {sectors.map((sector) => (
                      <Button
                        key={sector}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto py-3 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {sector}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="ghost"
                onClick={() => navigate("/manager/login")}
              >
                Giriş Yap
              </Button>
              <Button 
                className="bg-[#6E59A5] hover:bg-[#5A478A]"
                onClick={() => setIsTrialFormOpen(true)}
              >
                Ücretsiz Deneyin
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <HeroSection />
      <WeeklyPlaylists />
      <Features />
      <Pricing />
      <Footer />

      <TrialForm 
        open={isTrialFormOpen} 
        onOpenChange={setIsTrialFormOpen}
      />
    </div>
  );
}
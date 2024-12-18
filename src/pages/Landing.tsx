import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TrialForm } from "@/components/landing/TrialForm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const sectorGroups = {
  "Sağlık & Güzellik": [
    "Spor Salonu",
    "Medikal Merkezler",
    "Diş Klinikleri",
    "Güzellik Salonları",
    "SPA Merkezleri"
  ],
  "Perakende": [
    "Mağazalar",
    "AVM",
    "Market Zincirleri",
    "Butikler"
  ],
  "Hizmet Sektörü": [
    "Kafe & Restoran",
    "Oteller",
    "Bar & Publar",
    "Kafeler"
  ],
  "Kurumsal": [
    "Ofisler",
    "Okullar",
    "İş Merkezleri",
    "Plaza"
  ]
};

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
                <PopoverContent className="w-[500px] p-6" align="start">
                  <div className="grid grid-cols-2 gap-8">
                    {Object.entries(sectorGroups).map(([category, sectors]) => (
                      <div key={category} className="space-y-3">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {category}
                        </h3>
                        <div className="space-y-2">
                          {sectors.map((sector) => (
                            <Button
                              key={sector}
                              variant="ghost"
                              className="w-full justify-start text-left h-auto py-1.5 px-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                            >
                              {sector}
                            </Button>
                          ))}
                        </div>
                      </div>
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

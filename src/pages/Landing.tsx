import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { WeeklyPlaylists } from "@/components/landing/WeeklyPlaylists";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="text-gray-600 gap-2"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4" />
                Giriş
              </Button>
            </div>
            <div>
              <Button 
                className="bg-[#6E59A5] hover:bg-[#5A478A]"
                onClick={() => navigate("/manager/register")}
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
    </div>
  );
}
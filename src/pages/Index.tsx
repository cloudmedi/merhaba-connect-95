import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { PricingSection } from "@/components/landing/PricingSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { Footer } from "@/components/landing/Footer";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b fixed w-full bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold">Merhaba Connect</div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate("/manager/login")}>
                Giriş Yap
              </Button>
              <Button onClick={() => navigate("/manager/register")}>
                Ücretsiz Deneyin
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <HeroSection />
      <FeaturesGrid />
      <PricingSection />
      <StatsSection />
      <Footer />
    </div>
  );
}
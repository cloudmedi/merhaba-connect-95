import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b fixed w-full bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold">Merhaba Connect</div>
            <Button onClick={() => navigate("/landing")}>
              Landing Page
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Merhaba Connect</h1>
          <Button onClick={() => navigate("/landing")} size="lg">
            Keşfet
          </Button>
        </div>
      </div>
    </div>
  );
}
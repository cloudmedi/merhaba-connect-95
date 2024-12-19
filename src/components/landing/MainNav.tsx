import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MainNav() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-12">
            <Button 
              variant="ghost" 
              className="text-xl font-semibold text-[#8A2BE2] p-0"
              onClick={() => navigate("/")}
            >
              Startly
            </Button>
            
            <div className="hidden md:flex items-center gap-8">
              <Button variant="ghost" className="text-gray-600">Home</Button>
              <Button variant="ghost" className="text-gray-600">Features</Button>
              <Button variant="ghost" className="text-gray-600">Use Cases</Button>
              <Button variant="ghost" className="text-gray-600">Pricing</Button>
              <Button variant="ghost" className="text-gray-600">Pages</Button>
              <Button variant="ghost" className="text-gray-600">Contact</Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" className="text-gray-600">
              Sign In
            </Button>
            <Button className="bg-[#8A2BE2] hover:bg-[#7B1FA2] text-white rounded-full px-6">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
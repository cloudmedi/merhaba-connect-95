import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-4 px-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Link to="/help-support" className="text-sm text-gray-600 hover:text-gray-900">
            Help & Support
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/legal" className="text-sm text-gray-600 hover:text-gray-900">
              Legal & cookies
            </Link>
            <Link to="/cookie-preferences" className="text-sm text-gray-600 hover:text-gray-900">
              Cookie preferences
            </Link>
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
              Privacy Policy
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>©{currentYear} Lovable All rights reserved. Made with</span>
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          <span>in Istanbul</span>
        </div>
      </div>
    </footer>
  );
}
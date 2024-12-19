import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin, MessageCircle } from "lucide-react";

export function NewFooter() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="col-span-2 space-y-6">
            <Button 
              variant="ghost" 
              className="text-xl font-semibold text-white p-0"
            >
              Startly
            </Button>
            <div className="space-y-4">
              <p className="text-gray-400">+44 (0) 123 456 789</p>
              <p className="text-gray-400">123 Street Name, City, Country</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-3">
              <li><Button variant="link" className="text-gray-400 hover:text-white p-0">About</Button></li>
              <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Pricing</Button></li>
              <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Careers</Button></li>
              <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Features</Button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Blog</h3>
            <ul className="space-y-3">
              <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Newsletter</Button></li>
              <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Events</Button></li>
              <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Stories</Button></li>
              <li><Button variant="link" className="text-gray-400 hover:text-white p-0">News</Button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-3">
              <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Help Desk</Button></li>
              <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Privacy Policy</Button></li>
              <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Terms of Use</Button></li>
              <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Contact Us</Button></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Startly. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#8A2BE2]" />
              <span className="text-sm">Live Chat</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
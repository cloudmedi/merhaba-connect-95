import React from "react";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { TrialForm } from "@/components/landing/TrialForm";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface SectorLayoutProps {
  children: React.ReactNode;
}

const sectorGroups = {
  "Sağlık & Güzellik": [
    { name: "Spor Salonu", path: "/sectors/gym" },
    { name: "Medikal Merkezler", path: "/sectors/medical" },
    { name: "Diş Klinikleri", path: "/sectors/dental" },
    { name: "Güzellik Salonları", path: "/sectors/beauty" },
    { name: "SPA Merkezleri", path: "/sectors/spa" }
  ],
  "Perakende": [
    { name: "Mağazalar", path: "/sectors/retail" },
    { name: "AVM", path: "/sectors/mall" },
    { name: "Market Zincirleri", path: "/sectors/supermarket" },
    { name: "Butikler", path: "/sectors/boutique" }
  ],
  "Hizmet": [
    { name: "Kafe & Restoran", path: "/sectors/cafe" },
    { name: "Oteller", path: "/sectors/hotel" },
    { name: "Bar & Publar", path: "/sectors/bar" },
    { name: "Kafeler", path: "/sectors/coffee" }
  ]
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export function SectorLayout({ children }: SectorLayoutProps) {
  const navigate = useNavigate();
  const [isTrialFormOpen, setIsTrialFormOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                className="text-gray-600 gap-2 font-semibold"
                onClick={() => navigate("/")}
              >
                MusicBiz
              </Button>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-600 font-medium">
                      Sektörler
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                        {Object.entries(sectorGroups).map(([category, items]) => (
                          <div key={category} className="space-y-3">
                            <h3 className="font-medium text-sm text-gray-900 mb-2 px-3">
                              {category}
                            </h3>
                            <ul className="space-y-1">
                              {items.map((item) => (
                                <ListItem
                                  key={item.path}
                                  title={item.name}
                                  onClick={() => navigate(item.path)}
                                >
                                  Sektöre özel müzik çözümleri
                                </ListItem>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/pricing">
                      <NavigationMenuLink className="text-gray-600 font-medium">
                        Fiyatlandırma
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/about">
                      <NavigationMenuLink className="text-gray-600 font-medium">
                        Hakkımızda
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/contact">
                      <NavigationMenuLink className="text-gray-600 font-medium">
                        İletişim
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
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
      
      {children}
      
      <Footer />

      <TrialForm 
        open={isTrialFormOpen} 
        onOpenChange={setIsTrialFormOpen}
      />
    </div>
  );
}
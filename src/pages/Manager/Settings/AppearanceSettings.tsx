import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function AppearanceSettings() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'system'
    }
    return 'system'
  });

  const [language, setLanguage] = useState("tr");

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.remove('light', 'dark')
      root.classList.add(systemTheme)
    } else {
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
    }
    
    localStorage.setItem('theme', theme)
  }, [theme]);

  const handleThemeChange = (value: string) => {
    setTheme(value);
    toast.success("Tema ayarları güncellendi");
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast.success("Dil ayarları güncellendi");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base">Tema</Label>
          <p className="text-sm text-muted-foreground mb-4">
            Uygulama temasını seçin
          </p>
          <RadioGroup
            value={theme}
            onValueChange={handleThemeChange}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem
                value="light"
                id="light"
                className="peer sr-only"
              />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <span>Açık</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="dark"
                id="dark"
                className="peer sr-only"
              />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <span>Koyu</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="system"
                id="system"
                className="peer sr-only"
              />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <span>Sistem</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-6">
          <Label className="text-base">Dil</Label>
          <p className="text-sm text-muted-foreground mb-4">
            Uygulama dilini seçin
          </p>
          <RadioGroup
            value={language}
            onValueChange={handleLanguageChange}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem
                value="tr"
                id="tr"
                className="peer sr-only"
              />
              <Label
                htmlFor="tr"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <span>Türkçe</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="en"
                id="en"
                className="peer sr-only"
              />
              <Label
                htmlFor="en"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <span>English</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
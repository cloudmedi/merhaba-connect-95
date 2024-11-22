import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function AppearanceSettings() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
    toast.success(t('notifications.languageChanged'));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base">{t('settings.language.title')}</Label>
          <p className="text-sm text-gray-500 mb-4">
            {t('settings.language.description')}
          </p>
          <RadioGroup
            value={i18n.language}
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
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#6E59A5] [&:has([data-state=checked])]:border-[#6E59A5] cursor-pointer"
              >
                <span>{t('settings.language.turkish')}</span>
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
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#6E59A5] [&:has([data-state=checked])]:border-[#6E59A5] cursor-pointer"
              >
                <span>{t('settings.language.english')}</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
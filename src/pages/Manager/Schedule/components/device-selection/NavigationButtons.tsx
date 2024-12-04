import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
}

export function NavigationButtons({ onBack, onNext, isNextDisabled }: NavigationButtonsProps) {
  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack}>
        Geri
      </Button>
      <Button 
        onClick={onNext}
        disabled={isNextDisabled}
        className="bg-[#6E59A5] hover:bg-[#5a478a] text-white"
      >
        İleri
      </Button>
    </div>
  );
}
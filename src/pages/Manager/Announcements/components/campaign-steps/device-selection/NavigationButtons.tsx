import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
}

export function NavigationButtons({ 
  onBack, 
  onNext, 
  isNextDisabled 
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between pt-4 border-t">
      <Button variant="outline" onClick={onBack}>
        Geri
      </Button>
      <Button onClick={onNext} disabled={isNextDisabled}>
        İleri
      </Button>
    </div>
  );
}
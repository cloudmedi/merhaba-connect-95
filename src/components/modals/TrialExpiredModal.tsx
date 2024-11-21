import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface TrialExpiredModalProps {
  isOpen: boolean;
}

export function TrialExpiredModal({ isOpen }: TrialExpiredModalProps) {
  const handleContactAdmin = () => {
    window.location.href = "mailto:admin@example.com?subject=Trial Period Expired";
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-600">Trial Period Expired</DialogTitle>
          <DialogDescription className="mt-4 text-base">
            Your trial period has expired. Please contact the administrator to upgrade your account and continue using all features.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Button 
            onClick={handleContactAdmin}
            className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact Administrator
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { Button } from "@/components/ui/button";
import { Computer } from "lucide-react";
import { toast } from "sonner";

interface DeviceRegistrationProps {
  onRegister: () => Promise<void>;
}

export function DeviceRegistration({ onRegister }: DeviceRegistrationProps) {
  const handleRegister = async () => {
    try {
      await onRegister();
      toast.success('Device registered successfully');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register device');
    }
  };

  return (
    <div className="text-center">
      <Button onClick={handleRegister}>
        <Computer className="w-4 h-4 mr-2" />
        Register Device
      </Button>
    </div>
  );
}
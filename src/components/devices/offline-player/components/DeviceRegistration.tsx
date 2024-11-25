import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      toast.error('Failed to register device');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Device</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This device needs to be registered before it can be used as an offline player.
          A 6-digit token will be generated for device identification.
        </p>
        <Button onClick={handleRegister}>
          Register Device
        </Button>
      </CardContent>
    </Card>
  );
}
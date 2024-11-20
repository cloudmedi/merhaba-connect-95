import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export interface NotificationStepProps {
  formData: {
    notifications: Array<{
      type: 'email' | 'system' | 'both';
      timing: number;
    }>;
  };
  onFormDataChange: (data: Partial<NotificationStepProps['formData']>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function NotificationStep({ formData, onFormDataChange, onNext, onBack }: NotificationStepProps) {
  const addNotification = () => {
    onFormDataChange({
      notifications: [
        ...formData.notifications,
        { type: 'email', timing: 30 },
      ],
    });
  };

  const removeNotification = (index: number) => {
    const newNotifications = [...formData.notifications];
    newNotifications.splice(index, 1);
    onFormDataChange({ notifications: newNotifications });
  };

  const updateNotification = (index: number, field: 'type' | 'timing', value: any) => {
    const newNotifications = [...formData.notifications];
    newNotifications[index] = {
      ...newNotifications[index],
      [field]: field === 'timing' ? parseInt(value) : value,
    };
    onFormDataChange({ notifications: newNotifications });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {formData.notifications.map((notification, index) => (
          <div key={index} className="flex items-end gap-4 p-4 border rounded-lg">
            <div className="space-y-2 flex-1">
              <Label>Notification Type</Label>
              <Select
                value={notification.type}
                onValueChange={(value: 'email' | 'system' | 'both') =>
                  updateNotification(index, 'type', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <Label>Minutes Before</Label>
              <Input
                type="number"
                min="1"
                value={notification.timing}
                onChange={(e) => updateNotification(index, 'timing', e.target.value)}
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              className="mb-0.5"
              onClick={() => removeNotification(index)}
            >
              ×
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addNotification} className="w-full">
        Add Notification
      </Button>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
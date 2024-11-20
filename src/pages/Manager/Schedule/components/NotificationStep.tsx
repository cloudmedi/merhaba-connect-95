import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ScheduleEvent, EventNotification } from "../types";

interface NotificationStepProps {
  eventData: Partial<ScheduleEvent>;
  setEventData: (data: Partial<ScheduleEvent>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function NotificationStep({ eventData, setEventData, onNext, onBack }: NotificationStepProps) {
  const addNotification = (notification: EventNotification) => {
    setEventData({
      ...eventData,
      notifications: [...(eventData.notifications || []), notification]
    });
  };

  const removeNotification = (index: number) => {
    setEventData({
      ...eventData,
      notifications: eventData.notifications?.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Notification Type</Label>
            <Select
              onValueChange={(value: EventNotification['type']) =>
                addNotification({ type: value, timing: 30 })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          {eventData.notifications?.map((notification, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <Badge variant="secondary">
                {notification.type} - {notification.timing} minutes before
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeNotification(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} className="bg-[#6E59A5] hover:bg-[#5a478a] text-white">
          Next
        </Button>
      </div>
    </div>
  );
}
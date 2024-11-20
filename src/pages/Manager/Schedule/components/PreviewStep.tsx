import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { EventCategory } from "../types";

interface PreviewStepProps {
  formData: {
    title: string;
    category: EventCategory;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    branches: string[];
    notifications: { type: 'email' | 'system' | 'both'; timing: number; }[];
    recurrence?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number;
      endDate?: Date;
    };
  };
  onBack: () => void;
  onCreate: () => void;
}

export function PreviewStep({ formData, onBack, onCreate }: PreviewStepProps) {
  const getEventColor = (category: EventCategory) => {
    const colors = {
      'Marketing': '#F97316',
      'Special Promotion': '#D946EF',
      'Holiday Music': '#0EA5E9',
      'Regular Playlist': '#9b87f5',
      'Background Music': '#8E9196'
    };
    return colors[category];
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: getEventColor(formData.category) }}
          />
          <h3 className="text-lg font-semibold">{formData.title}</h3>
        </div>

        <div className="grid gap-4 text-sm">
          <div>
            <p className="text-gray-500">Category</p>
            <p>{formData.category}</p>
          </div>
          
          <div>
            <p className="text-gray-500">Schedule</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <p>
                  {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <p>
                  {formData.startTime} - {formData.endTime}
                </p>
              </div>
            </div>
          </div>

          {formData.recurrence && (
            <div>
              <p className="text-gray-500">Recurrence</p>
              <p>
                Every {formData.recurrence.interval}{" "}
                {formData.recurrence.frequency}
                {formData.recurrence.endDate &&
                  ` until ${formData.recurrence.endDate.toLocaleDateString()}`}
              </p>
            </div>
          )}

          <div>
            <p className="text-gray-500">Notifications</p>
            <ul className="list-disc list-inside">
              {formData.notifications.map((notification, index) => (
                <li key={index}>
                  {notification.type} - {notification.timing} minutes before
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-gray-500">Selected Branches</p>
            <p>{formData.branches.length} branches selected</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onCreate} 
          className="bg-[#6E59A5] hover:bg-[#5a478a] text-white"
        >
          Create Event
        </Button>
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { ScheduleEvent } from "../types";

interface PreviewStepProps {
  eventData: ScheduleEvent;
  onBack: () => void;
  onCreate: () => void;
}

export function PreviewStep({ eventData, onBack, onCreate }: PreviewStepProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: eventData.color.primary }}
          />
          <h3 className="text-lg font-semibold">{eventData.title}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Category</p>
            <p>{eventData.category}</p>
          </div>
          
          <div>
            <p className="text-gray-500">Time</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <p>
                {eventData.start && format(eventData.start, "PPp")} -
                {eventData.end && format(eventData.end, "PPp")}
              </p>
            </div>
          </div>

          {eventData.recurrence && (
            <div>
              <p className="text-gray-500">Recurrence</p>
              <p>
                Every {eventData.recurrence.interval}{" "}
                {eventData.recurrence.frequency}
                {eventData.recurrence.endDate &&
                  ` until ${format(eventData.recurrence.endDate, "PP")}`}
              </p>
            </div>
          )}

          <div>
            <p className="text-gray-500">Notifications</p>
            <ul className="list-disc list-inside">
              {eventData.notifications.map((notification, index) => (
                <li key={index}>
                  {notification.type} - {notification.timing} minutes before
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2">
            <p className="text-gray-500">Selected Branches</p>
            <p>{eventData.branches.length} branches selected</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onCreate} className="bg-[#6E59A5] hover:bg-[#5a478a] text-white">
          Create Event
        </Button>
      </div>
    </div>
  );
}
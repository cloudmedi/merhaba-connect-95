import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScheduleEvent } from "../types";

interface RecurrenceStepProps {
  eventData: Partial<ScheduleEvent>;
  setEventData: (data: Partial<ScheduleEvent>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function RecurrenceStep({ eventData, setEventData, onNext, onBack }: RecurrenceStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Repeat Frequency</Label>
          <Select
            value={eventData.recurrence?.frequency}
            onValueChange={(value: 'daily' | 'weekly' | 'monthly') =>
              setEventData({
                ...eventData,
                recurrence: {
                  ...eventData.recurrence,
                  frequency: value,
                  interval: 1
                }
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {eventData.recurrence?.frequency && (
          <>
            <div>
              <Label>Repeat Every</Label>
              <Input
                type="number"
                min="1"
                value={eventData.recurrence?.interval || 1}
                onChange={(e) =>
                  setEventData({
                    ...eventData,
                    recurrence: {
                      ...eventData.recurrence,
                      interval: parseInt(e.target.value)
                    }
                  })
                }
              />
            </div>

            <div>
              <Label>End Date (Optional)</Label>
              <Input
                type="date"
                value={eventData.recurrence?.endDate?.toISOString().split('T')[0]}
                onChange={(e) =>
                  setEventData({
                    ...eventData,
                    recurrence: {
                      ...eventData.recurrence,
                      endDate: e.target.value ? new Date(e.target.value) : undefined
                    }
                  })
                }
              />
            </div>
          </>
        )}
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
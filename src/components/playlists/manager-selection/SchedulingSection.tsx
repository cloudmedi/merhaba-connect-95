import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface SchedulingSectionProps {
  scheduledAt?: Date;
  expiresAt?: Date;
  onScheduledAtChange: (date?: Date) => void;
  onExpiresAtChange: (date?: Date) => void;
}

export function SchedulingSection({
  scheduledAt,
  expiresAt,
  onScheduledAtChange,
  onExpiresAtChange,
}: SchedulingSectionProps) {
  return (
    <div className="flex-1">
      <h4 className="text-sm font-medium mb-2">Schedule (Optional)</h4>
      <div className="flex gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              {scheduledAt ? format(scheduledAt, "PPP") : "Schedule date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={scheduledAt}
              onSelect={onScheduledAtChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              {expiresAt ? format(expiresAt, "PPP") : "Expiry date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={expiresAt}
              onSelect={onExpiresAtChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
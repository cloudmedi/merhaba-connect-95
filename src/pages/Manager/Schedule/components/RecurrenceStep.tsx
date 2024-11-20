import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export interface RecurrenceStepProps {
  formData: {
    recurrence?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number;
      endDate?: Date;
    };
  };
  onFormDataChange: (data: Partial<RecurrenceStepProps['formData']>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function RecurrenceStep({ formData, onFormDataChange, onNext, onBack }: RecurrenceStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Recurrence Frequency</Label>
        <Select
          value={formData.recurrence?.frequency || 'daily'}
          onValueChange={(value: 'daily' | 'weekly' | 'monthly') =>
            onFormDataChange({
              recurrence: {
                ...formData.recurrence,
                frequency: value,
                interval: formData.recurrence?.interval || 1,
              },
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

      <div className="space-y-2">
        <Label>Interval</Label>
        <Input
          type="number"
          min="1"
          value={formData.recurrence?.interval || 1}
          onChange={(e) =>
            onFormDataChange({
              recurrence: {
                ...formData.recurrence,
                interval: parseInt(e.target.value) || 1,
              },
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>End Date (Optional)</Label>
        <Input
          type="date"
          value={formData.recurrence?.endDate?.toISOString().split('T')[0] || ''}
          onChange={(e) =>
            onFormDataChange({
              recurrence: {
                ...formData.recurrence,
                endDate: e.target.value ? new Date(e.target.value) : undefined,
              },
            })
          }
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
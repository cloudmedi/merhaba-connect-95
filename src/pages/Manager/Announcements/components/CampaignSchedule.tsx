import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CampaignFormData } from "../types";

interface CampaignScheduleProps {
  formData: CampaignFormData;
  onFormDataChange: (data: Partial<CampaignFormData>) => void;
  onSubmit: () => Promise<void>;
  onBack: () => void;
}

export function CampaignSchedule({ 
  formData, 
  onFormDataChange, 
  onSubmit,
  onBack 
}: CampaignScheduleProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">Başlangıç Tarihi</Label>
          <Input
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => onFormDataChange({ startDate: e.target.value })}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Bitiş Tarihi</Label>
          <Input
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => onFormDataChange({ endDate: e.target.value })}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Tekrar Tipi</Label>
          <Select
            value={formData.repeatType}
            onValueChange={(value) => onFormDataChange({ repeatType: value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Tekrar tipini seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="once">Bir Kez</SelectItem>
              <SelectItem value="daily">Her Gün</SelectItem>
              <SelectItem value="weekly">Her Hafta</SelectItem>
              <SelectItem value="monthly">Her Ay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.repeatType !== 'once' && (
          <div>
            <Label className="text-base font-semibold">Tekrar Aralığı (dakika)</Label>
            <Input
              type="number"
              min={1}
              value={formData.repeatInterval}
              onChange={(e) => onFormDataChange({ repeatInterval: parseInt(e.target.value) })}
              className="mt-2"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack} size="lg">
          Geri
        </Button>
        <Button onClick={onSubmit} size="lg">
          Kampanya Oluştur
        </Button>
      </div>
    </div>
  );
}
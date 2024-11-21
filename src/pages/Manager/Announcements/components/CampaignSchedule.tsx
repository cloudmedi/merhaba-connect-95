import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CampaignFormData } from "../types";

interface CampaignScheduleProps {
  formData: CampaignFormData;
  onFormDataChange: (data: Partial<CampaignFormData>) => void;
}

export function CampaignSchedule({ formData, onFormDataChange }: CampaignScheduleProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Başlangıç Tarihi</Label>
          <Input
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => onFormDataChange({ startDate: e.target.value })}
          />
        </div>
        <div>
          <Label>Bitiş Tarihi</Label>
          <Input
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => onFormDataChange({ endDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Tekrar Tipi</Label>
        <RadioGroup
          value={formData.repeatType}
          onValueChange={(value) => onFormDataChange({ repeatType: value })}
          className="flex gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="once" id="once" />
            <Label htmlFor="once">Bir Kez</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="repeat" id="repeat" />
            <Label htmlFor="repeat">Tekrarlı</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.repeatType === "repeat" && (
        <div>
          <Label>Tekrar Aralığı</Label>
          <Select 
            value={formData.repeatInterval.toString()} 
            onValueChange={(value) => onFormDataChange({ repeatInterval: parseInt(value) })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Tekrar aralığı seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Günlük</SelectItem>
              <SelectItem value="7">Haftalık</SelectItem>
              <SelectItem value="30">Aylık</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
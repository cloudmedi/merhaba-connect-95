import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CampaignSchedule() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [repeatType, setRepeatType] = useState("once");
  const [repeatInterval, setRepeatInterval] = useState("daily");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Başlangıç Tarihi</Label>
          <Input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <Label>Bitiş Tarihi</Label>
          <Input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Tekrar Tipi</Label>
        <RadioGroup
          value={repeatType}
          onValueChange={setRepeatType}
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

      {repeatType === "repeat" && (
        <div>
          <Label>Tekrar Aralığı</Label>
          <Select value={repeatInterval} onValueChange={setRepeatInterval}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Tekrar aralığı seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Günlük</SelectItem>
              <SelectItem value="weekly">Haftalık</SelectItem>
              <SelectItem value="monthly">Aylık</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
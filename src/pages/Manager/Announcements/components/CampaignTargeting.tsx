import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CampaignTargeting() {
  const [priority, setPriority] = useState("normal");
  const [location, setLocation] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <Label>Öncelik Seviyesi</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Öncelik seviyesi seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Düşük</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">Yüksek</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Hedef Şube/Lokasyon</Label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Lokasyon seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Şubeler</SelectItem>
            <SelectItem value="istanbul">İstanbul Şubeleri</SelectItem>
            <SelectItem value="ankara">Ankara Şubeleri</SelectItem>
            <SelectItem value="izmir">İzmir Şubeleri</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
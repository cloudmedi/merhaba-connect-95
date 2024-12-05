import { FileUploadPreview } from "./FileUploadPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CampaignFormData } from "../types";

interface CampaignBasicInfoProps {
  formData: Pick<CampaignFormData, "title" | "description" | "files">;
  onFormDataChange: (data: Partial<CampaignFormData>) => void;
  onNext: () => void;
  announcementId: string | null;
}

export function CampaignBasicInfo({ 
  formData, 
  onFormDataChange, 
  onNext,
  announcementId 
}: CampaignBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Kampanya Başlığı</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onFormDataChange({ title: e.target.value })}
            placeholder="Kampanya başlığını girin"
          />
        </div>
        <div>
          <Label htmlFor="description">Açıklama</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onFormDataChange({ description: e.target.value })}
            placeholder="Kampanya açıklamasını girin"
          />
        </div>
        <div>
          <Label>Ses Dosyaları</Label>
          <FileUploadPreview
            files={formData.files}
            onFilesChange={(files) => onFormDataChange({ files })}
            maxFileSize={10}
            maxDuration={300}
            announcementId={announcementId}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={onNext}>İleri</Button>
      </div>
    </div>
  );
}
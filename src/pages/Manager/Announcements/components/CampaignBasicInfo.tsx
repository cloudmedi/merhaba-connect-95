import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileUploadPreview } from "./FileUploadPreview";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import type { CampaignFormData } from "../types";

interface CampaignBasicInfoProps {
  formData: CampaignFormData;
  onFormDataChange: (data: Partial<CampaignFormData>) => void;
  onNext: () => void;
}

export function CampaignBasicInfo({ formData, onFormDataChange, onNext }: CampaignBasicInfoProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const canProceed = formData.title.trim() && formData.files.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-6">Temel Bilgiler</h2>
        <div className="space-y-4">
          <div>
            <Label>Kampanya Adı</Label>
            <Input
              value={formData.title}
              onChange={(e) => onFormDataChange({ title: e.target.value })}
              placeholder="Kampanya adını girin"
            />
          </div>

          <div>
            <Label>Açıklama</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => onFormDataChange({ description: e.target.value })}
              placeholder="Kampanya açıklamasını girin"
              className="h-24"
            />
          </div>

          <div>
            <Label>Anonslar</Label>
            <div className="mt-2">
              <FileUploadPreview
                files={formData.files}
                onFilesChange={(files) => onFormDataChange({ files })}
                maxFileSize={10}
                maxDuration={300}
              />
            </div>
          </div>

          <div>
            <Label>Etiketler</Label>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Etiket eklemek için yazın ve Enter'a basın"
              className="mt-2"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="px-2 py-1">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={onNext} disabled={!canProceed}>
          İleri
        </Button>
      </div>
    </div>
  );
}
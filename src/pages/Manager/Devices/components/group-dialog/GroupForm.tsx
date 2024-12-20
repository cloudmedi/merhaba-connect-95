import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GroupFormProps {
  groupName: string;
  description: string;
  setGroupName: (value: string) => void;
  setDescription: (value: string) => void;
}

export function GroupForm({ groupName, description, setGroupName, setDescription }: GroupFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Grup Adı</Label>
        <Input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Grup adı girin"
        />
      </div>

      <div>
        <Label>Açıklama</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Açıklama girin"
        />
      </div>
    </div>
  );
}
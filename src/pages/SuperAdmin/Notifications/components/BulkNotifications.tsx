import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Send } from "lucide-react";
import { useState } from "react";

export function BulkNotifications() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("normal");
  const [targetGroup, setTargetGroup] = useState("");

  const handleSendNotification = () => {
    if (!title || !message || !targetGroup) {
      toast({
        title: "Hata",
        description: "Lütfen tüm gerekli alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Başarılı",
      description: "Bildirimler başarıyla gönderildi",
    });

    // Form'u sıfırla
    setTitle("");
    setMessage("");
    setPriority("normal");
    setTargetGroup("");
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Bell className="h-5 w-5 text-[#9b87f5]" />
          <h2>Toplu Bildirim Gönder</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Başlık</label>
              <Input
                placeholder="Bildirim başlığını girin"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Mesaj</label>
              <Textarea
                placeholder="Bildirim mesajını girin"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-32"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Hedef Grup</label>
              <Select value={targetGroup} onValueChange={setTargetGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Hedef grup seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kullanıcılar</SelectItem>
                  <SelectItem value="admins">Yöneticiler</SelectItem>
                  <SelectItem value="managers">Mağaza Yöneticileri</SelectItem>
                  <SelectItem value="players">Müzik Oynatıcıları</SelectItem>
                  <SelectItem value="users">Normal Kullanıcılar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Öncelik</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Öncelik seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Düşük</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Yüksek</SelectItem>
                  <SelectItem value="urgent">Acil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSendNotification} className="bg-[#9b87f5] hover:bg-[#7E69AB]">
            <Send className="w-4 h-4 mr-2" />
            Bildirimi Gönder
          </Button>
        </div>
      </div>
    </Card>
  );
}
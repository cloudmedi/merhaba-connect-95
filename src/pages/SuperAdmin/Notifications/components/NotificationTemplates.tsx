import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Template {
  id: number;
  name: string;
  title: string;
  message: string;
  category: string;
}

export function NotificationTemplates() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 1,
      name: "Sistem Bakımı",
      title: "Planlı Bakım Bildirimi",
      message: "Sistemimiz [TARİH] tarihinde bakıma alınacaktır. Hizmet kesintisi yaşanabilir.",
      category: "Sistem",
    },
    {
      id: 2,
      name: "Yeni Özellik",
      title: "Yeni Özellik Duyurusu",
      message: "Yeni özelliğimiz [ÖZELLİK] kullanıma açılmıştır!",
      category: "Güncellemeler",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    message: "",
    category: "",
  });

  const handleCreate = () => {
    setEditingTemplate(null);
    setFormData({
      name: "",
      title: "",
      message: "",
      category: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      title: template.title,
      message: template.message,
      category: template.category,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (templateId: number) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    toast({
      title: "Başarılı",
      description: "Şablon başarıyla silindi",
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.title || !formData.message || !formData.category) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    if (editingTemplate) {
      setTemplates(templates.map(t =>
        t.id === editingTemplate.id ? { ...formData, id: t.id } : t
      ));
      toast({
        title: "Başarılı",
        description: "Şablon başarıyla güncellendi",
      });
    } else {
      const newTemplate = {
        ...formData,
        id: templates.length + 1,
      };
      setTemplates([...templates, newTemplate]);
      toast({
        title: "Başarılı",
        description: "Yeni şablon başarıyla oluşturuldu",
      });
    }

    setIsDialogOpen(false);
    setEditingTemplate(null);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <MessageSquare className="h-5 w-5 text-[#9b87f5]" />
            <h2>Bildirim Şablonları</h2>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Şablon Oluştur
          </Button>
        </div>

        <ScrollArea className="h-[400px] rounded-md border">
          <div className="p-4 space-y-4">
            {templates.map((template) => (
              <Card key={template.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.title}</p>
                    <p className="text-sm">{template.message}</p>
                    <p className="text-xs text-gray-400">Kategori: {template.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Şablonu Düzenle" : "Yeni Şablon Oluştur"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Şablon Adı</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Şablon adını girin"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Başlık</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Bildirim başlığını girin"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Mesaj</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Bildirim mesajını girin"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Kategori</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sistem">Sistem</SelectItem>
                  <SelectItem value="Güncellemeler">Güncellemeler</SelectItem>
                  <SelectItem value="Duyurular">Duyurular</SelectItem>
                  <SelectItem value="Hatırlatmalar">Hatırlatmalar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleSubmit}>
                {editingTemplate ? "Güncelle" : "Oluştur"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
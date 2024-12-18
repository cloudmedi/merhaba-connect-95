import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const industries = [
  { id: "restaurant", label: "Restoran & Cafe" },
  { id: "retail", label: "Perakende" },
  { id: "hotel", label: "Otel & Konaklama" },
  { id: "fitness", label: "Spor & Fitness" },
  { id: "beauty", label: "Güzellik & Spa" },
  { id: "healthcare", label: "Sağlık" },
  { id: "education", label: "Eğitim" },
  { id: "other", label: "Diğer" }
];

const sources = [
  { id: "google", label: "Google" },
  { id: "social", label: "Sosyal Medya" },
  { id: "friend", label: "Arkadaş Tavsiyesi" },
  { id: "advertisement", label: "Reklam" },
  { id: "other", label: "Diğer" }
];

export function TrialForm({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    industry: "",
    source: "",
    additionalInfo: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.companyName || !formData.email || !formData.phone || !formData.industry || !formData.source) {
      toast.error("Lütfen tüm zorunlu alanları doldurun");
      return;
    }

    console.log("Form data:", formData);
    toast.success("Başvurunuz alındı! En kısa sürede size ulaşacağız.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-8 bg-[#F1F0FB]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#403E43] text-center mb-6">
            14 Gün Ücretsiz Deneyin
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-[#403E43] mb-1.5 block">
              Ad Soyad <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Ad Soyad"
              className="bg-white border-[#D3E4FD] focus:border-[#33C3F0] transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#403E43] mb-1.5 block">
              Firma Adı <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Firma Adı"
              className="bg-white border-[#D3E4FD] focus:border-[#33C3F0] transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#403E43] mb-1.5 block">
              İş E-posta <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ornek@firmaniz.com"
              className="bg-white border-[#D3E4FD] focus:border-[#33C3F0] transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#403E43] mb-1.5 block">
              Telefon Numarası <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0555 555 55 55"
              className="bg-white border-[#D3E4FD] focus:border-[#33C3F0] transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#403E43] mb-1.5 block">
              Sektör <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.industry}
              onValueChange={(value) => setFormData({ ...formData, industry: value })}
              required
            >
              <SelectTrigger className="bg-white border-[#D3E4FD] focus:border-[#33C3F0] transition-colors">
                <SelectValue placeholder="Sektör seçin" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.id} value={industry.id}>
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-[#403E43] mb-1.5 block">
              Bizi Nereden Duydunuz? <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.source}
              onValueChange={(value) => setFormData({ ...formData, source: value })}
              required
            >
              <SelectTrigger className="bg-white border-[#D3E4FD] focus:border-[#33C3F0] transition-colors">
                <SelectValue placeholder="Seçin" />
              </SelectTrigger>
              <SelectContent>
                {sources.map((source) => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-[#403E43] mb-1.5 block">
              Ek Bilgi
            </label>
            <Textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              placeholder="Eklemek istediğiniz notlar..."
              className="min-h-[100px] bg-white border-[#D3E4FD] focus:border-[#33C3F0] transition-colors"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#33C3F0] hover:bg-[#2BB0DD] text-white font-medium py-2.5 transition-colors"
          >
            Gönder
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
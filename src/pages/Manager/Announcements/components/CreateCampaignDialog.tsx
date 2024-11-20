import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUploadPreview } from "./FileUploadPreview";
import { PlaybackSettings } from "./PlaybackSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignBasicInfo } from "./CampaignBasicInfo";
import { CampaignSchedule } from "./CampaignSchedule";
import { CampaignTargeting } from "./CampaignTargeting";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Yeni Kampanya Oluştur</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
            <TabsTrigger value="schedule">Zamanlama</TabsTrigger>
            <TabsTrigger value="targeting">Hedefleme</TabsTrigger>
          </TabsList>

          <ScrollArea className="max-h-[70vh] mt-4">
            <TabsContent value="basic">
              <CampaignBasicInfo />
            </TabsContent>

            <TabsContent value="schedule">
              <CampaignSchedule />
            </TabsContent>

            <TabsContent value="targeting">
              <CampaignTargeting />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <div className="flex gap-2">
            {activeTab !== "basic" && (
              <Button variant="outline" onClick={() => setActiveTab(prev => {
                if (prev === "targeting") return "schedule";
                if (prev === "schedule") return "basic";
                return prev;
              })}>
                Geri
              </Button>
            )}
            {activeTab !== "targeting" ? (
              <Button onClick={() => setActiveTab(prev => {
                if (prev === "basic") return "schedule";
                if (prev === "schedule") return "targeting";
                return prev;
              })}>
                İleri
              </Button>
            ) : (
              <Button onClick={() => {
                toast.success("Kampanya başarıyla oluşturuldu");
                onOpenChange(false);
              }}>
                Kampanya Oluştur
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
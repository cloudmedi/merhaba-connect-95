import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignBasicInfo } from "./CampaignBasicInfo";
import { CampaignSchedule } from "./CampaignSchedule";
import { CampaignTargeting } from "./CampaignTargeting";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    files: [] as File[],
    startDate: "",
    endDate: "",
    repeatType: "once",
    repeatInterval: 1,
    branches: [] as string[]
  });
  const { user } = useAuth();

  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleCreateCampaign = async () => {
    try {
      if (!user) {
        toast.error("You must be logged in to create a campaign");
        return;
      }

      // Create announcement
      const { data: announcement, error: announcementError } = await supabase
        .from('announcements')
        .insert({
          title: formData.title,
          description: formData.description,
          start_date: formData.startDate,
          end_date: formData.endDate,
          repeat_type: formData.repeatType,
          repeat_interval: formData.repeatInterval,
          created_by: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (announcementError) throw announcementError;

      // Upload files and create announcement_files entries
      for (const file of formData.files) {
        const { data: fileData, error: uploadError } = await supabase.functions.invoke('upload-announcement', {
          body: {
            fileName: file.name,
            fileData: await file.arrayBuffer(),
            contentType: file.type,
            announcementId: announcement.id
          }
        });

        if (uploadError) throw uploadError;
      }

      // Create branch associations
      if (formData.branches.length > 0) {
        const { error: branchError } = await supabase
          .from('announcement_branches')
          .insert(
            formData.branches.map(branchId => ({
              announcement_id: announcement.id,
              branch_id: branchId
            }))
          );

        if (branchError) throw branchError;
      }

      toast.success("Campaign created successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast.error(error.message || "Failed to create campaign");
    }
  };

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
              <CampaignBasicInfo 
                formData={formData}
                onFormDataChange={handleFormDataChange}
              />
            </TabsContent>

            <TabsContent value="schedule">
              <CampaignSchedule 
                formData={formData}
                onFormDataChange={handleFormDataChange}
              />
            </TabsContent>

            <TabsContent value="targeting">
              <CampaignTargeting 
                formData={formData}
                onFormDataChange={handleFormDataChange}
              />
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
              <Button onClick={handleCreateCampaign}>
                Kampanya Oluştur
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
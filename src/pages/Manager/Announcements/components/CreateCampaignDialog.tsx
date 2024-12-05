import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CampaignBasicInfo } from "./CampaignBasicInfo";
import { CampaignSchedule } from "./CampaignSchedule";
import { DeviceSelectionStep } from "./campaign-steps/DeviceSelectionStep";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [announcementId, setAnnouncementId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    files: [] as File[],
    startDate: "",
    endDate: "",
    repeatType: "once",
    repeatInterval: 1,
    devices: [] as string[]
  });
  
  const { user } = useAuth();

  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const createAnnouncement = async () => {
    if (!user) {
      toast.error("Oturum açmanız gerekiyor");
      return null;
    }

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

    if (announcementError) {
      console.error('Error creating announcement:', announcementError);
      toast.error("Kampanya oluşturulurken bir hata oluştu");
      return null;
    }

    return announcement;
  };

  const handleCreateCampaign = async () => {
    try {
      if (!formData.title.trim()) {
        toast.error("Lütfen kampanya başlığı girin");
        return;
      }

      if (formData.files.length === 0) {
        toast.error("Lütfen en az bir dosya ekleyin");
        return;
      }

      if (formData.devices.length === 0) {
        toast.error("Lütfen en az bir cihaz seçin");
        return;
      }

      // Create announcement first
      const announcement = await createAnnouncement();
      if (!announcement) return;

      setAnnouncementId(announcement.id);

      // Get unique branch IDs from selected devices
      const { data: deviceBranches } = await supabase
        .from('devices')
        .select('branch_id')
        .in('id', formData.devices)
        .not('branch_id', 'is', null);

      const branchIds = [...new Set(deviceBranches?.map(d => d.branch_id) || [])];

      // Create announcement-branch associations
      if (branchIds.length > 0) {
        const { error: branchError } = await supabase
          .from('announcement_branches')
          .insert(
            branchIds.map(branchId => ({
              announcement_id: announcement.id,
              branch_id: branchId
            }))
          );

        if (branchError) throw branchError;
      }

      toast.success("Kampanya başarıyla oluşturuldu");
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast.error(error.message || "Kampanya oluşturulurken bir hata oluştu");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      files: [],
      startDate: "",
      endDate: "",
      repeatType: "once",
      repeatInterval: 1,
      devices: []
    });
    setAnnouncementId(null);
    setActiveTab("basic");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
            <TabsTrigger value="devices">Cihazlar ve Gruplar</TabsTrigger>
            <TabsTrigger value="schedule">Zamanlama</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6">
          {activeTab === "basic" && (
            <CampaignBasicInfo 
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onNext={() => setActiveTab("devices")}
              announcementId={announcementId}
            />
          )}
          {activeTab === "devices" && (
            <DeviceSelectionStep
              selectedDevices={formData.devices}
              onDevicesChange={(devices) => handleFormDataChange({ devices })}
              onNext={() => setActiveTab("schedule")}
              onBack={() => setActiveTab("basic")}
            />
          )}
          {activeTab === "schedule" && (
            <CampaignSchedule 
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onSubmit={handleCreateCampaign}
              onBack={() => setActiveTab("devices")}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
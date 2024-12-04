import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  const [step, setStep] = useState(1);
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

  const handleCreateCampaign = async () => {
    try {
      if (!user) {
        toast.error("Oturum açmanız gerekiyor");
        return;
      }

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
    setStep(1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CampaignBasicInfo 
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <DeviceSelectionStep
            selectedDevices={formData.devices}
            onDevicesChange={(devices) => handleFormDataChange({ devices })}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        return (
          <CampaignSchedule 
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onBack={() => setStep(2)}
            onSubmit={handleCreateCampaign}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}
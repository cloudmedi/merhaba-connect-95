import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CampaignBasicInfo } from "./CampaignBasicInfo";
import { CampaignSchedule } from "./CampaignSchedule";
import { DeviceSelectionStep } from "./campaign-steps/DeviceSelectionStep";
import { CampaignFormData } from "../types";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [announcementId, setAnnouncementId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    description: "",
    files: [],
    startDate: "",
    endDate: "",
    repeatType: "once",
    repeatInterval: 1,
    devices: []
  });
  
  const { user } = useAuth();

  const handleFormDataChange = async (data: Partial<CampaignFormData>) => {
    // If title is being changed, create or update the announcement
    if ('title' in data && data.title !== formData.title) {
      if (data.title && !announcementId) {
        const result = await createAnnouncement(data.title);
        if (result) {
          setAnnouncementId(result.id);
        }
      } else if (announcementId) {
        // Update existing announcement
        const { error } = await supabase
          .from('announcements')
          .update({ title: data.title })
          .eq('id', announcementId);

        if (error) {
          console.error('Error updating announcement:', error);
          toast.error("Failed to update announcement title");
        }
      }
    }
    
    setFormData(prev => ({ ...prev, ...data }));
  };

  const createAnnouncement = async (title: string) => {
    if (!user) {
      toast.error("You must be logged in to create an announcement");
      return null;
    }

    const { data: announcement, error } = await supabase
      .from('announcements')
      .insert({
        title,
        created_by: user.id,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating announcement:', error);
      toast.error("Failed to create announcement");
      return null;
    }

    return announcement;
  };

  const handleCreateCampaign = async () => {
    try {
      if (!announcementId) {
        toast.error("No announcement created. Please try again.");
        return;
      }

      if (formData.devices.length === 0) {
        toast.error("Please select at least one device");
        return;
      }

      // Get unique branch IDs from selected devices
      const { data: deviceBranches } = await supabase
        .from('devices')
        .select('branch_id')
        .in('id', formData.devices)
        .not('branch_id', 'is', null);

      const branchIds = [...new Set(deviceBranches?.map(d => d.branch_id) || [])];

      // Update announcement with schedule details
      const { error: updateError } = await supabase
        .from('announcements')
        .update({
          description: formData.description,
          start_date: formData.startDate,
          end_date: formData.endDate,
          repeat_type: formData.repeatType,
          repeat_interval: formData.repeatInterval
        })
        .eq('id', announcementId);

      if (updateError) throw updateError;

      // Create announcement-branch associations
      if (branchIds.length > 0) {
        const { error: branchError } = await supabase
          .from('announcement_branches')
          .insert(
            branchIds.map(branchId => ({
              announcement_id: announcementId,
              branch_id: branchId
            }))
          );

        if (branchError) throw branchError;
      }

      toast.success("Campaign created successfully");
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast.error(error.message || "Failed to create campaign");
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
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
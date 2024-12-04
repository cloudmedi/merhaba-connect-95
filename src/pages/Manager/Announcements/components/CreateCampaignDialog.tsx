import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignBasicInfo } from "./CampaignBasicInfo";
import { CampaignSchedule } from "./CampaignSchedule";
import { DeviceSelection } from "@/components/devices/branch-groups/DeviceSelection";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { Device } from "@/pages/Manager/Devices/hooks/types";
import type { CampaignFormData } from "../types";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const [activeTab, setActiveTab] = useState("basic");
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

  // Fetch devices for the company
  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user?.id)
        .single();

      if (!userProfile?.company_id) return [];

      const { data } = await supabase
        .from('devices')
        .select('*')
        .eq('branches.company_id', userProfile.company_id);

      return data as Device[] || [];
    },
    enabled: !!user
  });

  const handleFormDataChange = (data: Partial<CampaignFormData>) => {
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

      // Create device associations using announcement_branches
      if (formData.devices.length > 0) {
        const { error: deviceError } = await supabase
          .from('announcement_branches')
          .insert(
            formData.devices.map(deviceId => ({
              announcement_id: announcement.id,
              branch_id: devices.find(d => d.id === deviceId)?.branch_id || ''
            }))
          );

        if (deviceError) throw deviceError;
      }

      toast.success("Campaign created successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast.error(error.message || "Failed to create campaign");
    }
  };

  const [deviceSearchQuery, setDeviceSearchQuery] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Yeni Kampanya Oluştur</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
            <TabsTrigger value="schedule">Zamanlama</TabsTrigger>
          </TabsList>

          <ScrollArea className="max-h-[70vh] mt-4">
            <TabsContent value="basic">
              <CampaignBasicInfo 
                formData={formData}
                onFormDataChange={handleFormDataChange}
              />
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Cihazlar</h3>
                <DeviceSelection
                  devices={devices}
                  selectedDevices={formData.devices}
                  searchQuery={deviceSearchQuery}
                  setSearchQuery={setDeviceSearchQuery}
                  setSelectedDevices={(devices) => handleFormDataChange({ devices })}
                />
              </div>
            </TabsContent>

            <TabsContent value="schedule">
              <CampaignSchedule 
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
              <Button variant="outline" onClick={() => setActiveTab("basic")}>
                Geri
              </Button>
            )}
            {activeTab === "basic" ? (
              <Button onClick={() => setActiveTab("schedule")}>
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
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
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch devices for the company
  const { data: devices = [], isLoading: isLoadingDevices } = useQuery({
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
        .select(`
          *,
          branches (
            id,
            name
          )
        `)
        .eq('branches.company_id', userProfile.company_id);

      return (data || []) as Device[];
    },
    enabled: !!user
  });

  // Fetch branch groups
  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ['branch-groups'],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user?.id)
        .single();

      if (!userProfile?.company_id) return [];

      const { data } = await supabase
        .from('branch_groups')
        .select(`
          *,
          branch_group_assignments (
            branch_id,
            branches (
              id,
              name,
              devices (
                id,
                name,
                status
              )
            )
          )
        `)
        .eq('company_id', userProfile.company_id);

      return data || [];
    },
    enabled: !!user
  });

  const handleFormDataChange = (data: Partial<CampaignFormData>) => {
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
      const selectedDevices = devices.filter(d => formData.devices.includes(d.id));
      const branchIds = [...new Set(selectedDevices
        .map(d => d.branch_id)
        .filter((id): id is string => id !== null)
      )];

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
    setSearchQuery("");
  };

  const handleSelectGroup = (groupId: string, isSelected: boolean) => {
    const groupDevices = groups
      .find(g => g.id === groupId)
      ?.branch_group_assignments
      ?.flatMap(assignment => 
        assignment.branches?.devices?.map(device => device.id) || []
      ) || [];

    if (isSelected) {
      // Add all devices from the group that aren't already selected
      const newDevices = [...new Set([...formData.devices, ...groupDevices])];
      handleFormDataChange({ devices: newDevices });
    } else {
      // Remove all devices that belong to this group
      const remainingDevices = formData.devices.filter(
        deviceId => !groupDevices.includes(deviceId)
      );
      handleFormDataChange({ devices: remainingDevices });
    }
  };

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
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Cihazlar ve Gruplar</h3>
                <DeviceSelection
                  devices={devices}
                  groups={groups}
                  selectedDevices={formData.devices}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  setSelectedDevices={(devices) => handleFormDataChange({ devices })}
                  onSelectGroup={handleSelectGroup}
                  isLoading={isLoadingDevices || isLoadingGroups}
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
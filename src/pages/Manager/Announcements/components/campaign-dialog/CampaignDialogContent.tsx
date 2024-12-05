import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignBasicInfo } from "../CampaignBasicInfo";
import { DeviceSelectionStep } from "../campaign-steps/DeviceSelectionStep";
import { CampaignSchedule } from "../CampaignSchedule";
import { CampaignFormData } from "../../types";

interface CampaignDialogContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: CampaignFormData;
  onFormDataChange: (data: Partial<CampaignFormData>) => Promise<void>;
  onSubmit: () => Promise<void>;
  announcementId: string | null;
}

export function CampaignDialogContent({
  activeTab,
  setActiveTab,
  formData,
  onFormDataChange,
  onSubmit,
  announcementId
}: CampaignDialogContentProps) {
  return (
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
            onFormDataChange={onFormDataChange}
            onNext={() => setActiveTab("devices")}
            announcementId={announcementId}
          />
        )}
        {activeTab === "devices" && (
          <DeviceSelectionStep
            selectedDevices={formData.devices}
            onDevicesChange={(devices) => onFormDataChange({ devices })}
            onNext={() => setActiveTab("schedule")}
            onBack={() => setActiveTab("basic")}
          />
        )}
        {activeTab === "schedule" && (
          <CampaignSchedule 
            formData={formData}
            onFormDataChange={onFormDataChange}
            onSubmit={onSubmit}
            onBack={() => setActiveTab("devices")}
          />
        )}
      </div>
    </Tabs>
  );
}
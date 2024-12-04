import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { EventDetailsStep } from "./EventDetailsStep";
import { RecurrenceStep } from "./RecurrenceStep";
import { NotificationStep } from "./NotificationStep";
import { DeviceSelectionStep } from "./DeviceSelectionStep";
import { PreviewStep } from "./PreviewStep";
import { toast } from "sonner";
import { ScheduleEvent, EventNotification, EventRecurrence } from "../types";
import { checkEventConflicts } from "../utils/eventUtils";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingEvents: ScheduleEvent[];
  initialTimeRange?: {
    start: string;
    end: string;
  } | null;
}

interface EventFormData {
  title: string;
  playlistId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  devices: string[];
  notifications: EventNotification[];
  recurrence?: EventRecurrence;
}

export function CreateEventDialog({ open, onOpenChange, existingEvents, initialTimeRange }: CreateEventDialogProps) {
  const [currentTab, setCurrentTab] = useState("details");
  const [formData, setFormData] = useState<EventFormData>(() => getInitialFormData(initialTimeRange));

  function getInitialFormData(timeRange: { start: string; end: string; } | null | undefined): EventFormData {
    if (timeRange) {
      const startDateTime = new Date(timeRange.start);
      const endDateTime = new Date(timeRange.end);

      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
      };

      const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      };

      return {
        title: "",
        playlistId: "",
        startDate: formatDate(startDateTime),
        startTime: formatTime(startDateTime),
        endDate: formatDate(endDateTime),
        endTime: formatTime(endDateTime),
        devices: [],
        notifications: [],
      };
    }
    
    return {
      title: "",
      playlistId: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      devices: [],
      notifications: [],
    };
  }

  const handleCreate = async () => {
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    const eventData: ScheduleEvent = {
      id: crypto.randomUUID(),
      title: formData.title,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      playlist_id: formData.playlistId,
      color: { primary: '#9b87f5', secondary: '#E5DEFF', text: '#1A1F2C' },
      notifications: formData.notifications,
      recurrence: formData.recurrence,
      devices: formData.devices.map(deviceId => ({ device_id: deviceId }))
    };

    const conflicts = checkEventConflicts(eventData, existingEvents);
    if (conflicts.length > 0) {
      toast.error("Çakışan etkinlikler var", {
        description: "Bu zaman aralığında başka etkinlikler mevcut",
      });
      return;
    }

    toast.success("Etkinlik başarıyla oluşturuldu");
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      playlistId: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      devices: [],
      notifications: [],
    });
    setCurrentTab("details");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Etkinlik Oluştur</DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="details">Detaylar</TabsTrigger>
            <TabsTrigger value="recurrence">Tekrar</TabsTrigger>
            <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
            <TabsTrigger value="devices">Cihazlar</TabsTrigger>
            <TabsTrigger value="preview">Önizleme</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="details">
              <EventDetailsStep 
                formData={formData}
                onFormDataChange={(data) => setFormData({ ...formData, ...data })}
                onNext={() => setCurrentTab("recurrence")}
                onCancel={() => onOpenChange(false)}
              />
            </TabsContent>

            <TabsContent value="recurrence">
              <RecurrenceStep
                formData={formData}
                onFormDataChange={(data) => setFormData({ ...formData, ...data })}
                onNext={() => setCurrentTab("notifications")}
                onBack={() => setCurrentTab("details")}
              />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationStep
                formData={formData}
                onFormDataChange={(data) => setFormData({ ...formData, ...data })}
                onNext={() => setCurrentTab("devices")}
                onBack={() => setCurrentTab("recurrence")}
              />
            </TabsContent>

            <TabsContent value="devices">
              <DeviceSelectionStep
                selectedDevices={formData.devices}
                onDevicesChange={(devices) => setFormData({ ...formData, devices })}
                onNext={() => setCurrentTab("preview")}
                onBack={() => setCurrentTab("notifications")}
              />
            </TabsContent>

            <TabsContent value="preview">
              <PreviewStep
                formData={formData}
                onBack={() => setCurrentTab("devices")}
                onCreate={handleCreate}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
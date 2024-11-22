import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { EventDetailsStep } from "./EventDetailsStep";
import { BranchSelectionStep } from "./BranchSelectionStep";
import { RecurrenceStep } from "./RecurrenceStep";
import { NotificationStep } from "./NotificationStep";
import { PreviewStep } from "./PreviewStep";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { EventCategory } from "../types";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingEvents: any[];
  initialTimeRange?: {
    start: string;
    end: string;
  } | null;
}

export function CreateEventDialog({ 
  open, 
  onOpenChange, 
  existingEvents, 
  initialTimeRange 
}: CreateEventDialogProps) {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState("details");
  const [formData, setFormData] = useState(() => getInitialFormData(initialTimeRange));

  useEffect(() => {
    if (initialTimeRange) {
      setFormData(getInitialFormData(initialTimeRange));
    }
  }, [initialTimeRange]);

  const handleCreate = async () => {
    toast.success("Event created successfully");
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
      category: "Regular Playlist" as EventCategory,
      branches: [],
      notifications: []
    });
    setCurrentTab("details");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{t('schedule.createEvent.title')}</DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="details">{t('schedule.createEvent.steps.details')}</TabsTrigger>
            <TabsTrigger value="recurrence">{t('schedule.createEvent.steps.recurrence')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('schedule.createEvent.steps.notifications')}</TabsTrigger>
            <TabsTrigger value="branches">{t('schedule.createEvent.steps.branches')}</TabsTrigger>
            <TabsTrigger value="preview">{t('schedule.createEvent.steps.preview')}</TabsTrigger>
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
                onNext={() => setCurrentTab("branches")}
                onBack={() => setCurrentTab("recurrence")}
              />
            </TabsContent>

            <TabsContent value="branches">
              <BranchSelectionStep
                selectedBranches={formData.branches}
                onBranchesChange={(branches) => setFormData({ ...formData, branches })}
                onNext={() => setCurrentTab("preview")}
                onBack={() => setCurrentTab("notifications")}
              />
            </TabsContent>

            <TabsContent value="preview">
              <PreviewStep
                formData={formData}
                onBack={() => setCurrentTab("branches")}
                onCreate={handleCreate}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function getInitialFormData(timeRange: { start: string; end: string; } | null | undefined) {
  if (timeRange) {
    const startDateTime = new Date(timeRange.start);
    const endDateTime = new Date(timeRange.end);

    return {
      title: "",
      playlistId: "",
      startDate: startDateTime.toISOString().split('T')[0],
      startTime: startDateTime.toTimeString().split(' ')[0],
      endDate: endDateTime.toISOString().split('T')[0],
      endTime: endDateTime.toTimeString().split(' ')[0],
      category: "Regular Playlist" as EventCategory,
      branches: [],
      notifications: []
    };
  }

  return {
    title: "",
    playlistId: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    category: "Regular Playlist" as EventCategory,
    branches: [],
    notifications: []
  };
}
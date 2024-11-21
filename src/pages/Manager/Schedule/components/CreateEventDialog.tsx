import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { EventDetailsStep } from "./EventDetailsStep";
import { BranchSelectionStep } from "./BranchSelectionStep";
import { RecurrenceStep } from "./RecurrenceStep";
import { NotificationStep } from "./NotificationStep";
import { PreviewStep } from "./PreviewStep";
import { toast } from "sonner";
import { ScheduleEvent, EventCategory, EventNotification, EventRecurrence } from "../types";
import { checkEventConflicts } from "../utils/eventUtils";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingEvents: ScheduleEvent[];
}

interface EventFormData {
  title: string;
  playlistId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  category: EventCategory;
  branches: string[];
  notifications: EventNotification[];
  recurrence?: EventRecurrence;
}

export function CreateEventDialog({ open, onOpenChange, existingEvents }: CreateEventDialogProps) {
  const [currentTab, setCurrentTab] = useState("details");
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    playlistId: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    category: "Regular Playlist",
    branches: [],
    notifications: [],
  });

  const handleCreate = async () => {
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    const eventData: ScheduleEvent = {
      id: crypto.randomUUID(),
      title: formData.title,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      playlist_id: formData.playlistId,
      category: formData.category,
      color: getEventColor(formData.category),
      notifications: formData.notifications,
      recurrence: formData.recurrence,
    };

    const conflicts = checkEventConflicts(eventData, existingEvents);
    if (conflicts.length > 0) {
      toast.error("Event conflicts detected", {
        description: "This event overlaps with existing events",
      });
      return;
    }

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
      category: "Regular Playlist",
      branches: [],
      notifications: [],
    });
    setCurrentTab("details");
  };

  const getEventColor = (category: EventCategory): EventColor => {
    const colors = {
      'Marketing': { primary: '#F97316', secondary: '#FEC6A1', text: '#1A1F2C' },
      'Special Promotion': { primary: '#D946EF', secondary: '#FFDEE2', text: '#1A1F2C' },
      'Holiday Music': { primary: '#0EA5E9', secondary: '#D3E4FD', text: '#1A1F2C' },
      'Regular Playlist': { primary: '#9b87f5', secondary: '#E5DEFF', text: '#1A1F2C' },
      'Background Music': { primary: '#8E9196', secondary: '#F1F0FB', text: '#1A1F2C' }
    };
    return colors[category];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create Schedule Event</DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="recurrence">Recurrence</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
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
                onCreate={handleCreate}
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
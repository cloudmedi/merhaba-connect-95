import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EventDetailsStep } from "./EventDetailsStep";
import { BranchSelectionStep } from "./BranchSelectionStep";
import { RecurrenceStep } from "./RecurrenceStep";
import { NotificationStep } from "./NotificationStep";
import { PreviewStep } from "./PreviewStep";
import { toast } from "sonner";
import { ScheduleEvent } from "../types";
import { checkEventConflicts } from "../utils/eventUtils";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingEvents: ScheduleEvent[];
}

export function CreateEventDialog({ open, onOpenChange, existingEvents }: CreateEventDialogProps) {
  const [currentTab, setCurrentTab] = useState("details");
  const [eventData, setEventData] = useState<Partial<ScheduleEvent>>({
    title: "",
    category: "Regular Playlist",
    color: {
      primary: "#9b87f5",
      secondary: "#E5DEFF",
      text: "#1A1F2C"
    },
    notifications: [],
    branches: []
  });

  const handleCreate = async () => {
    if (!eventData.start || !eventData.end) {
      toast.error("Please select event start and end times");
      return;
    }

    const conflicts = checkEventConflicts(eventData as ScheduleEvent, existingEvents);
    if (conflicts.length > 0) {
      toast.error("Event conflicts detected", {
        description: "This event overlaps with existing events",
      });
      return;
    }

    // Handle event creation logic here
    toast.success("Event created successfully");
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setEventData({
      title: "",
      category: "Regular Playlist",
      color: {
        primary: "#9b87f5",
        secondary: "#E5DEFF",
        text: "#1A1F2C"
      },
      notifications: [],
      branches: []
    });
    setCurrentTab("details");
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
                eventData={eventData}
                setEventData={setEventData}
                onNext={() => setCurrentTab("recurrence")}
              />
            </TabsContent>

            <TabsContent value="recurrence">
              <RecurrenceStep
                eventData={eventData}
                setEventData={setEventData}
                onNext={() => setCurrentTab("notifications")}
                onBack={() => setCurrentTab("details")}
              />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationStep
                eventData={eventData}
                setEventData={setEventData}
                onNext={() => setCurrentTab("branches")}
                onBack={() => setCurrentTab("recurrence")}
              />
            </TabsContent>

            <TabsContent value="branches">
              <BranchSelectionStep
                selectedBranches={eventData.branches || []}
                onBranchesChange={(branches) => 
                  setEventData(prev => ({ ...prev, branches }))
                }
                onNext={() => setCurrentTab("preview")}
                onBack={() => setCurrentTab("notifications")}
              />
            </TabsContent>

            <TabsContent value="preview">
              <PreviewStep
                eventData={eventData as ScheduleEvent}
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
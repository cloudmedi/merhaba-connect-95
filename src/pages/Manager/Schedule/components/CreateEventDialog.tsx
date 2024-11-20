import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EventDetailsStep } from "./EventDetailsStep";
import { BranchSelectionStep } from "./BranchSelectionStep";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEventDialog({ open, onOpenChange }: CreateEventDialogProps) {
  const [step, setStep] = useState<'details' | 'branches'>('details');
  const [eventData, setEventData] = useState({
    title: "",
    playlist: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    selectedBranches: [] as string[]
  });

  const handleNext = () => {
    setStep('branches');
  };

  const handleBack = () => {
    setStep('details');
  };

  const handleCreate = () => {
    // Handle event creation logic here
    console.log('Creating event:', eventData);
    onOpenChange(false);
    setStep('details');
    // Reset form
    setEventData({
      title: "",
      playlist: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      selectedBranches: []
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>

        {step === 'details' ? (
          <EventDetailsStep 
            eventData={eventData}
            setEventData={setEventData}
            onNext={handleNext}
            onCancel={() => onOpenChange(false)}
          />
        ) : (
          <BranchSelectionStep
            selectedBranches={eventData.selectedBranches}
            onBranchesChange={(branches) => 
              setEventData(prev => ({ ...prev, selectedBranches: branches }))
            }
            onBack={handleBack}
            onCreate={handleCreate}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
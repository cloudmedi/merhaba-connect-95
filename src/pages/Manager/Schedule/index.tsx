import { DashboardLayout } from "@/components/DashboardLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function Schedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <DashboardLayout
      title="Schedule"
      description="Manage your device schedules and calendar events"
    >
      <Card className="p-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border w-full"
        />
      </Card>
    </DashboardLayout>
  );
}
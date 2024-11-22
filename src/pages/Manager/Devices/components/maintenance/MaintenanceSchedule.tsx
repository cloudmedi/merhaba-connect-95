import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface MaintenanceTask {
  id: string;
  title: string;
  date: Date;
  type: "routine" | "emergency" | "upgrade";
  status: "pending" | "completed" | "overdue";
}

export function MaintenanceSchedule() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks] = useState<MaintenanceTask[]>([
    {
      id: "1",
      title: "System Update",
      date: new Date(),
      type: "routine",
      status: "pending"
    },
    {
      id: "2",
      title: "Hardware Check",
      date: new Date(),
      type: "routine",
      status: "completed"
    }
  ]);

  const handleScheduleMaintenance = () => {
    toast.success("Maintenance task scheduled successfully");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Schedule Maintenance</h3>
        <div className="space-y-4">
          <div>
            <Label>Task Title</Label>
            <Input placeholder="Enter maintenance task title" />
          </div>
          <div>
            <Label>Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
          <Button onClick={handleScheduleMaintenance} className="w-full">
            Schedule Maintenance
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Upcoming Maintenance</h3>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{task.date.toLocaleDateString()}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{task.date.toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium
                    ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'}`}>
                    {task.status}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
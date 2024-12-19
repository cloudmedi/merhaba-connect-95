import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SystemStats } from "./SystemStats";
import { MetricsChart } from "./charts/MetricsChart";
import { ActivityChart } from "./charts/ActivityChart";
import { DraggableWidget } from "./DraggableWidget";
import { DashboardWidget } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const defaultWidgets: DashboardWidget[] = [
  { id: "stats", type: "stats", title: "System Stats", position: 0, size: "large" },
  { id: "metrics", type: "chart", title: "Metrics", position: 1, size: "medium" },
  { id: "activity", type: "chart", title: "Activity", position: 2, size: "medium" },
];

export function CustomDashboard() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(defaultWidgets);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.type) {
      case "stats":
        return <SystemStats />;
      case "chart":
        return widget.id === "metrics" ? <MetricsChart /> : <ActivityChart />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Widget
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {widgets.map((widget) => (
              <DraggableWidget key={widget.id} widget={widget}>
                {renderWidget(widget)}
              </DraggableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
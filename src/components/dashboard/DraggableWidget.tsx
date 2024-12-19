import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { DashboardWidget } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface DraggableWidgetProps {
  widget: DashboardWidget;
  children: React.ReactNode;
}

export function DraggableWidget({ widget, children }: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "h-full",
        isDragging && "z-50 opacity-50"
      )}
      {...attributes}
      {...listeners}
    >
      <Card className="h-full p-6 cursor-move">
        {children}
      </Card>
    </div>
  );
}
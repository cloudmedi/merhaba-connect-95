import { DashboardLayout } from "@/components/DashboardLayout";
import { MoodsContent } from "./MoodsContent";

export default function Moods() {
  return (
    <DashboardLayout 
      title="Moods" 
      description="Manage music moods and emotions"
    >
      <MoodsContent />
    </DashboardLayout>
  );
}
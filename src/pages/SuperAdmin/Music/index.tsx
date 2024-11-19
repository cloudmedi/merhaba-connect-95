import { DashboardLayout } from "@/components/DashboardLayout";
import { MusicContent } from "./MusicContent";

export default function Music() {
  return (
    <DashboardLayout 
      title="Music Library" 
      description="Manage your music collection"
    >
      <MusicContent />
    </DashboardLayout>
  );
}
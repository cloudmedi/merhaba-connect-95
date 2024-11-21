import { DashboardLayout } from "@/components/DashboardLayout";
import { MusicContent } from "./MusicContent";

export default function Music() {
  return (
    <DashboardLayout 
      title="Music Library"
      description="Manage and organize your music collection"
    >
      <MusicContent />
    </DashboardLayout>
  );
}
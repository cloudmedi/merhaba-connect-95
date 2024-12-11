import { DashboardLayout } from "@/components/DashboardLayout";
import { MusicLibrary } from "./MusicLibrary";

export default function Music() {
  return (
    <DashboardLayout 
      title="Music Library"
      description="Manage and organize your music collection"
    >
      <MusicLibrary />
    </DashboardLayout>
  );
}
import { DashboardLayout } from "@/components/DashboardLayout";
import { GenresContent } from "./GenresContent";

export default function Genres() {
  return (
    <DashboardLayout 
      title="Genres" 
      description="Manage music genres for playlists"
    >
      <GenresContent />
    </DashboardLayout>
  );
}
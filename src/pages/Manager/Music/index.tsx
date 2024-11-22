import { DashboardLayout } from "@/components/DashboardLayout";
import { SongStatistics } from "@/components/music/SongStatistics";

export default function Music() {
  return (
    <DashboardLayout
      title="Müzik İstatistikleri"
      description="Şarkı çalma istatistikleri ve analizleri"
    >
      <div className="space-y-8">
        <SongStatistics />
      </div>
    </DashboardLayout>
  );
}
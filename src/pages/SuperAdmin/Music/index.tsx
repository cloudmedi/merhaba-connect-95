import { MusicContent } from "./MusicContent";
import { AdminNav } from "@/components/AdminNav";

export default function Music() {
  return (
    <div className="flex h-screen bg-white">
      <AdminNav />
      <main className="flex-1 overflow-auto bg-white">
        <MusicContent />
      </main>
    </div>
  );
}
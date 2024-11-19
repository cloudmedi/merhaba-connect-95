import { AdminNav } from "@/components/AdminNav";
import { MoodsContent } from "./MoodsContent";

export default function Moods() {
  return (
    <div className="flex h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8 overflow-auto bg-white">
        <MoodsContent />
      </main>
    </div>
  );
}
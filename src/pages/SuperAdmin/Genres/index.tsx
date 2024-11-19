import { AdminNav } from "@/components/AdminNav";
import { GenresContent } from "./GenresContent";

export default function Genres() {
  return (
    <div className="flex h-screen bg-[#1A1F2C]">
      <AdminNav />
      <main className="flex-1 p-8 overflow-auto">
        <GenresContent />
      </main>
    </div>
  );
}
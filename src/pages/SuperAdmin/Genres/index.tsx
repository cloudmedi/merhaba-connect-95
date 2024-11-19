import { AdminNav } from "@/components/AdminNav";
import { GenresContent } from "./GenresContent";

export default function Genres() {
  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 p-8 overflow-auto bg-white">
        <GenresContent />
      </main>
    </div>
  );
}
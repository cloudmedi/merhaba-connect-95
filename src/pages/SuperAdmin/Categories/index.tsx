import { AdminNav } from "@/components/AdminNav";
import { CategoriesContent } from "./CategoriesContent";

export default function Categories() {
  return (
    <div className="flex h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8 overflow-auto">
        <CategoriesContent />
      </main>
    </div>
  );
}
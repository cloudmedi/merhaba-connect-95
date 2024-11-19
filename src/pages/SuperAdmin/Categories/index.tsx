import { DashboardLayout } from "@/components/DashboardLayout";
import { CategoriesContent } from "./CategoriesContent";

export default function Categories() {
  return (
    <DashboardLayout 
      title="Categories" 
      description="Manage your music categories"
    >
      <CategoriesContent />
    </DashboardLayout>
  );
}
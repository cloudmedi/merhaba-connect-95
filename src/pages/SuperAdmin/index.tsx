import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function SuperAdmin() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
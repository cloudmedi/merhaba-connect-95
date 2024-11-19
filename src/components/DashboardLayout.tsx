import { ReactNode } from "react";
import { AdminNav } from "./AdminNav";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-[#F8F9FC]">
      <AdminNav />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {title && (
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {description && (
                  <p className="text-sm text-gray-500 mt-1">{description}</p>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
import { ReactNode } from "react";
import { AdminNav } from "./AdminNav";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <AdminNav />
      <div className="flex-1 w-full md:w-[calc(100%-16rem)] ml-0 md:ml-64">
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {title && (
              <div className="mb-8">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
                {description && (
                  <p className="text-sm text-gray-500 mt-1">{description}</p>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
import { ReactNode } from "react";
import { AdminNav } from "@/components/AdminNav";

interface SuperAdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function SuperAdminLayout({ children, title, description }: SuperAdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#1A1F2C]">
      <AdminNav />
      <div className="flex-1 overflow-auto w-full md:w-[calc(100%-16rem)] ml-0 md:ml-64">
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {title && (
              <div className="mb-8">
                <h1 className="text-xl md:text-2xl font-bold text-white">{title}</h1>
                {description && (
                  <p className="text-sm text-gray-400 mt-1">{description}</p>
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
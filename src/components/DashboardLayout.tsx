import { ReactNode } from "react";
import { AdminNav } from "./AdminNav";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {title && (
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
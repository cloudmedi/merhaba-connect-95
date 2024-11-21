import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { TrialFooter } from "./dashboard/TrialFooter";
import { TrialExpiredModal } from "./modals/TrialExpiredModal";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const { user } = useAuth();
  const isTrialExpired = user?.company?.trial_status === 'expired';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 py-8 px-4 sm:px-8">
            {title && (
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {description && (
                  <p className="mt-1 text-gray-500">{description}</p>
                )}
              </div>
            )}
            {children}
          </main>
        </div>
        {user?.company?.trial_status === 'active' && <TrialFooter />}
        <TrialExpiredModal isOpen={isTrialExpired} />
      </div>
    </div>
  );
}
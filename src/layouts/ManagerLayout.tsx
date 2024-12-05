import { ReactNode } from "react";
import { ManagerHeader } from "@/components/ManagerHeader";

interface ManagerLayoutProps {
  children: ReactNode;
}

export function ManagerLayout({ children }: ManagerLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col h-screen">
        <ManagerHeader />
        <main className="flex-1 overflow-auto px-4 md:px-8 py-6 max-w-[1400px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";

export function ManagerHeader() {
  const { user } = useAuth();
  const firstName = user?.firstName || 'User';

  return (
    <div className="bg-[#F5F5F5] px-4 md:px-8 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium text-gray-500">Welcome back,</h1>
          <p className="text-xl font-semibold text-gray-900">{firstName}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#9b87f5] text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
          </Button>
          <div className="h-8 w-8 rounded-full bg-[#9b87f5] flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {firstName.charAt(0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
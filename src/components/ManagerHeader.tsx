import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";

export function ManagerHeader() {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.firstName || user?.user_metadata?.first_name || 'User';

  return (
    <div className="bg-gradient-to-b from-[#282828] to-[#121212] px-4 md:px-8 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium text-gray-400">Welcome back,</h1>
          <p className="text-xl font-semibold text-white">{firstName}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-400 hover:text-white hover:bg-[#282828]"
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
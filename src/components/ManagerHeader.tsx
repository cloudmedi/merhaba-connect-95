import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OnlineUsers } from "./header/OnlineUsers";

interface OnlineUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  lastSeen: string;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Günaydın";
  if (hour >= 12 && hour < 17) return "İyi Günler";
  return "İyi Akşamlar";
};

export function ManagerHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const managerView = localStorage.getItem('managerView');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const users = Object.values(presenceState).flat().map((p: any) => ({
          id: p.user_id,
          email: p.email,
          firstName: p.firstName,
          lastName: p.lastName,
          lastSeen: new Date().toISOString(),
        }));
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const handleReturnToSuperAdmin = () => {
    localStorage.removeItem('managerView');
    navigate('/super-admin/users');
    toast.success("Super Admin paneline geri dönüldü");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Left Section */}
        <div className="flex flex-1 items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900 animate-fade-in">
            {getGreeting()}
          </h1>
          {managerView && (
            <Button 
              variant="outline" 
              onClick={handleReturnToSuperAdmin}
              className="flex items-center gap-2 text-[#9b87f5] border-[#9b87f5] hover:bg-[#9b87f5]/5"
            >
              Super Admin'e Geri Dön
            </Button>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <OnlineUsers onlineUsers={onlineUsers} />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>
        </div>
      </div>
    </header>
  );
}
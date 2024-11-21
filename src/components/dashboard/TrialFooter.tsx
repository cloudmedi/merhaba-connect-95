import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function TrialFooter() {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
  } | null>(null);

  useEffect(() => {
    if (!user?.company?.trial_ends_at) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(user.company.trial_ends_at);

      if (now >= endDate) {
        setTimeLeft(null);
        return;
      }

      const days = differenceInDays(endDate, now);
      const hours = differenceInHours(endDate, now) % 24;
      const minutes = differenceInMinutes(endDate, now) % 60;

      setTimeLeft({ days, hours, minutes });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000 * 60); // Update every minute

    return () => clearInterval(interval);
  }, [user?.company?.trial_ends_at]);

  if (!timeLeft || user?.company?.trial_status !== 'active') return null;

  // Show warning toast when less than 3 days remaining
  useEffect(() => {
    if (timeLeft?.days <= 3) {
      toast.warning(
        `Trial expires in ${timeLeft.days} days and ${timeLeft.hours} hours. Contact administrator to upgrade.`,
        { duration: 10000 }
      );
    }
  }, [timeLeft?.days]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 flex items-center justify-center space-x-2">
      <AlertCircle className="w-4 h-4" />
      <span>
        Trial expires in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
      </span>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddDeviceDialog } from "./AddDeviceDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function DeviceHeader() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: licenseInfo } = useQuery({
    queryKey: ['licenseInfo'],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*, licenses(*)')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const { count: currentDevices } = await supabase
        .from('devices')
        .select('*', { count: 'exact' })
        .eq('branches.company_id', userProfile?.company_id);

      return {
        limit: userProfile?.licenses?.[0]?.quantity || 0,
        used: currentDevices || 0
      };
    }
  });

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Devices</h2>
        {licenseInfo && (
          <p className="text-sm text-muted-foreground">
            Using {licenseInfo.used} of {licenseInfo.limit} device licenses
          </p>
        )}
      </div>
      <Button onClick={() => setShowAddDialog(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Device
      </Button>
      <AddDeviceDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}
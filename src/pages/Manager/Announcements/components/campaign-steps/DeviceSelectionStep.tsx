import { useState } from "react";
import { DeviceSelection } from "@/components/devices/branch-groups/DeviceSelection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DeviceSelectionStepProps {
  selectedDevices: string[];
  onDevicesChange: (devices: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DeviceSelectionStep({
  selectedDevices,
  onDevicesChange,
  onNext,
  onBack
}: DeviceSelectionStepProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: devices = [], isLoading: isLoadingDevices } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile?.company_id) return [];

      const { data } = await supabase
        .from('devices')
        .select(`
          *,
          branches (
            id,
            name,
            company_id
          )
        `)
        .eq('branches.company_id', userProfile.company_id);

      return data || [];
    }
  });

  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ['branch-groups'],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile?.company_id) return [];

      const { data } = await supabase
        .from('branch_groups')
        .select(`
          *,
          branch_group_assignments (
            branch_id,
            branches (
              id,
              name,
              devices (
                id,
                name,
                status
              )
            )
          )
        `)
        .eq('company_id', userProfile.company_id);

      return data || [];
    }
  });

  const handleSelectGroup = (groupId: string, isSelected: boolean) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    const deviceIds = group.branch_group_assignments
      ?.flatMap(assignment => assignment.branches?.devices?.map(device => device.id) || []) || [];

    if (isSelected) {
      const newDevices = [...new Set([...selectedDevices, ...deviceIds])];
      onDevicesChange(newDevices);
    } else {
      const remainingDevices = selectedDevices.filter(id => !deviceIds.includes(id));
      onDevicesChange(remainingDevices);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-2">Cihaz ve Grup Seçimi</h2>
          <p className="text-sm text-gray-500">
            Kampanyanın oynatılacağı cihazları veya grupları seçin
          </p>
        </div>

        <DeviceSelection
          devices={devices}
          groups={groups}
          selectedDevices={selectedDevices}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSelectedDevices={onDevicesChange}
          onSelectGroup={handleSelectGroup}
          isLoading={isLoadingDevices || isLoadingGroups}
        />

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
          <Button 
            onClick={onNext}
            disabled={selectedDevices.length === 0}
          >
            İleri
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CampaignFormData, Branch } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface CampaignTargetingProps {
  formData: CampaignFormData;
  onFormDataChange: (data: Partial<CampaignFormData>) => void;
}

export function CampaignTargeting({ formData, onFormDataChange }: CampaignTargetingProps) {
  const [open, setOpen] = useState(false);

  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devices')
        .select(`
          id,
          name,
          status,
          branches (
            id,
            name
          )
        `)
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const handleDeviceSelect = (deviceId: string) => {
    const newDevices = formData.devices.includes(deviceId)
      ? formData.devices.filter(id => id !== deviceId)
      : [...formData.devices, deviceId];
    
    onFormDataChange({ devices: newDevices });
    toast.success(
      formData.devices.includes(deviceId) 
        ? "Cihaz kaldırıldı" 
        : "Cihaz eklendi"
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>Cihazlar</Label>
        <p className="text-sm text-gray-500 mb-2">
          Kampanyanın oynatılacağı cihazları seçin
        </p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {formData.devices.length > 0
                ? `${formData.devices.length} cihaz seçildi`
                : "Cihaz seçin..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Cihaz ara..." />
              <CommandEmpty>Cihaz bulunamadı.</CommandEmpty>
              <CommandGroup>
                {devices?.map((device) => (
                  <CommandItem
                    key={device.id}
                    value={device.id}
                    onSelect={() => handleDeviceSelect(device.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        formData.devices.includes(device.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{device.name}</span>
                      {device.branches?.name && (
                        <span className="text-xs text-gray-500">{device.branches.name}</span>
                      )}
                      <span className={`text-xs ${device.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                        ● {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {formData.devices.length > 0 && (
        <div className="rounded-lg border p-4 bg-gray-50">
          <h4 className="text-sm font-medium mb-2">Seçili Cihazlar</h4>
          <div className="space-y-2">
            {formData.devices.map(deviceId => {
              const device = devices?.find(d => d.id === deviceId);
              return (
                <div key={deviceId} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm">{device?.name}</span>
                    {device?.branches?.name && (
                      <span className="text-xs text-gray-500">{device.branches.name}</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeviceSelect(deviceId)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    Kaldır
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
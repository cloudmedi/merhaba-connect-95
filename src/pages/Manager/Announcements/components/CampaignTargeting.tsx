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

  const { data: branches, isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select(`
          id,
          name,
          location
        `)
        .order('name');

      if (error) throw error;
      return data as Branch[];
    }
  });

  const handleBranchSelect = (branchId: string) => {
    const newBranches = formData.branches.includes(branchId)
      ? formData.branches.filter(id => id !== branchId)
      : [...formData.branches, branchId];
    
    onFormDataChange({ branches: newBranches });
    toast.success(
      formData.branches.includes(branchId) 
        ? "Şube kaldırıldı" 
        : "Şube eklendi"
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
        <Label>Şubeler</Label>
        <p className="text-sm text-gray-500 mb-2">
          Kampanyanın oynatılacağı şubeleri seçin
        </p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {formData.branches.length > 0
                ? `${formData.branches.length} şube seçildi`
                : "Şube seçin..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Şube ara..." />
              <CommandEmpty>Şube bulunamadı.</CommandEmpty>
              <CommandGroup>
                {branches?.map((branch) => (
                  <CommandItem
                    key={branch.id}
                    value={branch.id}
                    onSelect={() => handleBranchSelect(branch.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        formData.branches.includes(branch.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {branch.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {formData.branches.length > 0 && (
        <div className="rounded-lg border p-4 bg-gray-50">
          <h4 className="text-sm font-medium mb-2">Seçili Şubeler</h4>
          <div className="space-y-2">
            {formData.branches.map(branchId => {
              const branch = branches?.find(b => b.id === branchId);
              return (
                <div key={branchId} className="flex items-center justify-between">
                  <span className="text-sm">{branch?.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBranchSelect(branchId)}
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
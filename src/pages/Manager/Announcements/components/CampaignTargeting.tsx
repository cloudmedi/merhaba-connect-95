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

interface CampaignTargetingProps {
  formData: CampaignFormData;
  onFormDataChange: (data: Partial<CampaignFormData>) => void;
}

export function CampaignTargeting({ formData, onFormDataChange }: CampaignTargetingProps) {
  const [open, setOpen] = useState(false);

  const { data: branches, isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      // For now, we'll use the companies table as branches
      // In a real implementation, you would have a separate branches table
      const { data, error } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          created_at,
          updated_at
        `)
        .order('name');

      if (error) throw error;
      return data as Branch[];
    }
  });

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
                    onSelect={(currentValue) => {
                      const newBranches = formData.branches.includes(currentValue)
                        ? formData.branches.filter((id) => id !== currentValue)
                        : [...formData.branches, currentValue];
                      onFormDataChange({ branches: newBranches });
                    }}
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
    </div>
  );
}
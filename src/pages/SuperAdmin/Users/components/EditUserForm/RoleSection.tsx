import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Crown, User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EditUserFormValues } from "./types";

interface RoleSectionProps {
  form: UseFormReturn<EditUserFormValues>;
}

export function RoleSection({ form }: RoleSectionProps) {
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Role</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <label htmlFor="admin" className="cursor-pointer flex items-center">
                  <Crown className="h-4 w-4 mr-1 text-[#9b87f5]" />
                  Admin
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manager" id="manager" />
                <label htmlFor="manager" className="cursor-pointer flex items-center">
                  <User className="h-4 w-4 mr-1 text-[#9b87f5]" />
                  Manager
                </label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
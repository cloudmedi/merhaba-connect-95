import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./formSchema";
import { Shield, Users } from "lucide-react";

interface UserRoleSelectProps {
  form: UseFormReturn<FormValues>;
}

export function UserRoleSelect({ form }: UserRoleSelectProps) {
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Rol</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Rol seçiniz" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </SelectItem>
              <SelectItem value="manager" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Yönetici</span>
              </SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Admin tüm yetkilere sahipken, yöneticilerin sınırlı yetkileri vardır
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
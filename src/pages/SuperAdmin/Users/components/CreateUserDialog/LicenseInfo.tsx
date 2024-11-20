import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./formSchema";
import { Crown, Clock } from "lucide-react";

interface LicenseInfoProps {
  form: UseFormReturn<FormValues>;
}

export function LicenseInfo({ form }: LicenseInfoProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="license.type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>License Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select license type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="trial" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Trial</span>
                </SelectItem>
                <SelectItem value="premium" className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  <span>Premium</span>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Trial licenses are valid for 30 days, Premium licenses can be customized
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="license.startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>License activation date</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="license.endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>License expiration date</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="license.quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Licenses</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1"
                {...field}
                onChange={e => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormDescription>Number of concurrent users allowed</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
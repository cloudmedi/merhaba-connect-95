import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Crown, Key } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { CreateUserFormValues } from "./types";

interface LicenseSectionProps {
  form: UseFormReturn<CreateUserFormValues>;
}

export function LicenseSection({ form }: LicenseSectionProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="license.type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>License Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="trial" id="trial" />
                  <label htmlFor="trial" className="cursor-pointer flex items-center">
                    <Key className="h-4 w-4 mr-1 text-[#9b87f5]" />
                    Trial (14 days)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="premium" id="premium" />
                  <label htmlFor="premium" className="cursor-pointer flex items-center">
                    <Crown className="h-4 w-4 mr-1 text-[#9b87f5]" />
                    Premium
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="license.start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>License Start Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    field.onChange(date.toISOString());
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="license.end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>License End Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    field.onChange(date.toISOString());
                  }}
                />
              </FormControl>
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
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
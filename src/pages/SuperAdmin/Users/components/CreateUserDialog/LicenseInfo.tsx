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
            <FormLabel>Lisans Tipi</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Lisans tipi seçiniz" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="trial" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Deneme</span>
                </SelectItem>
                <SelectItem value="premium" className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  <span>Premium</span>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Deneme sürümü 30 gün geçerlidir, Premium lisans özelleştirilebilir
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
              <FormLabel>Başlangıç Tarihi</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>Lisansın aktif olacağı tarih</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="license.endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bitiş Tarihi</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>Lisansın sona ereceği tarih</FormDescription>
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
            <FormLabel>Lisans Sayısı</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1"
                {...field}
                onChange={e => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormDescription>Aynı anda kullanılabilecek lisans sayısı</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
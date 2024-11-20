import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./formSchema";
import { User, Mail, Building2 } from "lucide-react";

interface UserBasicInfoProps {
  form: UseFormReturn<FormValues>;
}

export function UserBasicInfo({ form }: UserBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input placeholder="Adınız" className="pl-8" {...field} />
                </div>
              </FormControl>
              <FormDescription>Kullanıcının adını giriniz</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Soyad</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input placeholder="Soyadınız" className="pl-8" {...field} />
                </div>
              </FormControl>
              <FormDescription>Kullanıcının soyadını giriniz</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="email" placeholder="ornek@sirket.com" className="pl-8" {...field} />
              </div>
            </FormControl>
            <FormDescription>Bu email adresi giriş için kullanılacaktır</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Şirket Adı</FormLabel>
            <FormControl>
              <div className="relative">
                <Building2 className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input placeholder="Şirket adını giriniz" className="pl-8" {...field} />
              </div>
            </FormControl>
            <FormDescription>Resmi şirket adını giriniz</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
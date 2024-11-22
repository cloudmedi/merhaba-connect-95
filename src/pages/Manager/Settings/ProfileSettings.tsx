import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Settings2 } from "lucide-react";

const profileFormSchema = z.object({
  firstName: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyisim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email adresi giriniz"),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Şifre en az 6 karakter olmalıdır").optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileSettings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);

      // Profil bilgilerini güncelle
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
        })
        .eq("id", user?.id);

      if (profileError) throw profileError;

      // Şifre değişikliği varsa güncelle
      if (data.currentPassword && data.newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: data.newPassword,
        });

        if (passwordError) throw passwordError;
      }

      toast.success("Profil başarıyla güncellendi");
    } catch (error: any) {
      toast.error("Profil güncellenirken hata oluştu: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold">Profil Ayarları</h2>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b">
              <div className="p-3 bg-purple-100 rounded-full">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">{user?.firstName} {user?.lastName}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İsim</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soyisim</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 pt-6 border-t">
              <h3 className="font-medium">Şifre Değiştir</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mevcut Şifre</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yeni Şifre</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
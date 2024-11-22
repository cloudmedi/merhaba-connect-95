import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { NotificationToggle } from "./NotificationToggle";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  device_status_alerts: z.boolean(),
  maintenance_reminders: z.boolean(),
  system_updates: z.boolean(),
  email_notifications: z.boolean(),
});

const notificationSettings = [
  {
    name: "device_status_alerts",
    label: "Device Status Alerts",
    description: "Get notified about device status changes",
  },
  {
    name: "maintenance_reminders",
    label: "Maintenance Reminders",
    description: "Receive reminders about scheduled maintenance",
  },
  {
    name: "system_updates",
    label: "System Updates",
    description: "Get notified about system updates and changes",
  },
  {
    name: "email_notifications",
    label: "Email Notifications",
    description: "Receive notifications via email",
  },
];

export function NotificationSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      device_status_alerts: settings?.device_status_alerts ?? true,
      maintenance_reminders: settings?.maintenance_reminders ?? true,
      system_updates: settings?.system_updates ?? true,
      email_notifications: settings?.email_notifications ?? true,
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { error } = await supabase
        .from('notification_settings')
        .upsert(values);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      toast.success("Notification settings saved successfully");
    },
    onError: (error) => {
      toast.error("Failed to save settings: " + error.message);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => updateSettings.mutate(values))} className="space-y-6">
        <div className="space-y-4">
          {notificationSettings.map((setting) => (
            <NotificationToggle
              key={setting.name}
              name={setting.name as keyof z.infer<typeof formSchema>}
              label={setting.label}
              description={setting.description}
              control={form.control}
            />
          ))}
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
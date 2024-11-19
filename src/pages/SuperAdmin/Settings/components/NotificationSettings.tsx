import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { NotificationToggle } from "./NotificationToggle";

const formSchema = z.object({
  systemAlerts: z.boolean(),
  maintenanceNotices: z.boolean(),
  billingNotifications: z.boolean(),
  playlistChanges: z.boolean(),
  newDevices: z.boolean(),
  securityAlerts: z.boolean(),
  reportGeneration: z.boolean(),
  userActivity: z.boolean(),
});

const notificationSettings = [
  {
    name: "systemAlerts",
    label: "System Alerts",
    description: "Receive notifications about system performance and issues",
  },
  {
    name: "maintenanceNotices",
    label: "Maintenance Notices",
    description: "Get notified about scheduled maintenance and updates",
  },
  {
    name: "billingNotifications",
    label: "Billing Notifications",
    description: "Receive updates about invoices and payments",
  },
  {
    name: "playlistChanges",
    label: "Playlist Changes",
    description: "Get notified when playlists are modified",
  },
  {
    name: "newDevices",
    label: "New Device Alerts",
    description: "Receive notifications when new devices are registered",
  },
  {
    name: "securityAlerts",
    label: "Security Alerts",
    description: "Get notified about security-related events",
  },
  {
    name: "reportGeneration",
    label: "Report Generation",
    description: "Receive notifications when reports are generated",
  },
  {
    name: "userActivity",
    label: "User Activity",
    description: "Get notified about important user activities",
  },
];

export function NotificationSettings() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      systemAlerts: true,
      maintenanceNotices: true,
      billingNotifications: true,
      playlistChanges: true,
      newDevices: true,
      securityAlerts: true,
      reportGeneration: false,
      userActivity: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Notification settings saved successfully");
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
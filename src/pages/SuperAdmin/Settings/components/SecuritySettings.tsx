import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z.object({
  passwordMinLength: z.string(),
  passwordComplexity: z.string(),
  mfaRequired: z.boolean(),
  sessionTimeout: z.string(),
  maxLoginAttempts: z.string(),
  ipWhitelist: z.string(),
  autoLockout: z.boolean(),
  lockoutDuration: z.string(),
});

export function SecuritySettings() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passwordMinLength: "8",
      passwordComplexity: "medium",
      mfaRequired: false,
      sessionTimeout: "30",
      maxLoginAttempts: "5",
      ipWhitelist: "",
      autoLockout: true,
      lockoutDuration: "30",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Security settings saved successfully");
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="passwordMinLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Password Length</FormLabel>
                <FormControl>
                  <Input {...field}
                    type="number"
                    min="8"
                    max="32"
                  />
                </FormControl>
                <FormDescription>Minimum 8 characters recommended</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordComplexity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Complexity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complexity level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low (Letters + Numbers)</SelectItem>
                    <SelectItem value="medium">Medium (+ Special Characters)</SelectItem>
                    <SelectItem value="high">High (+ Mixed Case)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sessionTimeout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Timeout (minutes)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxLoginAttempts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Login Attempts</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lockoutDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lockout Duration (minutes)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ipWhitelist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IP Whitelist</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Comma-separated IP addresses" />
                </FormControl>
                <FormDescription>Leave empty to allow all IPs</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="mfaRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Require Two-Factor Authentication
                </FormLabel>
                <FormDescription>
                  Enforce 2FA for all admin and manager accounts
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="autoLockout"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Automatic Account Lockout</FormLabel>
                <FormDescription>
                  Automatically lock accounts after failed login attempts
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
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
  defaultVolume: z.string(),
  crossfadeDuration: z.string(),
  audioQuality: z.string(),
  bufferingStrategy: z.string(),
  enableGapless: z.boolean(),
  enableNormalization: z.boolean(),
  maxConcurrentStreams: z.string(),
  streamingProtocol: z.string(),
});

export function BroadcastingSettings() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultVolume: "80",
      crossfadeDuration: "2",
      audioQuality: "high",
      bufferingStrategy: "adaptive",
      enableGapless: true,
      enableNormalization: true,
      maxConcurrentStreams: "unlimited",
      streamingProtocol: "http",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Broadcasting settings saved successfully");
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="defaultVolume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Volume (%)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="0" max="100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="crossfadeDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crossfade Duration (seconds)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="0" max="10" step="0.5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="audioQuality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Audio Quality</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audio quality" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low (96kbps)</SelectItem>
                    <SelectItem value="medium">Medium (128kbps)</SelectItem>
                    <SelectItem value="high">High (320kbps)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bufferingStrategy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buffering Strategy</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select buffering strategy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="adaptive">Adaptive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxConcurrentStreams"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Concurrent Streams</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select max streams" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                    <SelectItem value="1">1 per Location</SelectItem>
                    <SelectItem value="2">2 per Location</SelectItem>
                    <SelectItem value="3">3 per Location</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="streamingProtocol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Streaming Protocol</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select streaming protocol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="http">HTTP Live Streaming</SelectItem>
                    <SelectItem value="rtmp">RTMP</SelectItem>
                    <SelectItem value="dash">DASH</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="enableGapless"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Gapless Playback</FormLabel>
                <FormDescription>
                  Enable seamless transitions between tracks
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
          name="enableNormalization"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Audio Normalization</FormLabel>
                <FormDescription>
                  Automatically adjust volume levels across different tracks
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
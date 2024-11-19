import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, Edit, Trash } from "lucide-react";

interface NotificationTemplate {
  id: number;
  name: string;
  title: string;
  message: string;
  category: string;
}

export function NotificationTemplates() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: 1,
      name: "System Maintenance",
      title: "Scheduled Maintenance Notice",
      message: "Our system will undergo maintenance on [DATE]. Service may be interrupted.",
      category: "System",
    },
    {
      id: 2,
      name: "New Feature",
      title: "New Feature Announcement",
      message: "We're excited to announce our new feature: [FEATURE]",
      category: "Updates",
    },
  ]);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <MessageSquare className="h-5 w-5 text-[#9b87f5]" />
            <h2>Notification Templates</h2>
          </div>
          <Button
            onClick={() => {
              toast({
                title: "Create Template",
                description: "Template creation feature coming soon",
              });
            }}
            className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>

        <ScrollArea className="h-[400px] rounded-md border">
          <div className="p-4 space-y-4">
            {templates.map((template) => (
              <Card key={template.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.title}</p>
                    <p className="text-sm">{template.message}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Edit Template",
                          description: "Template editing feature coming soon",
                        });
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        toast({
                          title: "Delete Template",
                          description: "Template deletion feature coming soon",
                        });
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
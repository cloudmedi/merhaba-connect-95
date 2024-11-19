import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Zap, Plus, Settings2 } from "lucide-react";

interface AutomationRule {
  id: number;
  name: string;
  description: string;
  event: string;
  active: boolean;
}

export function AutomationRules() {
  const { toast } = useToast();
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: 1,
      name: "New Playlist Alert",
      description: "Send notification when a new playlist is created",
      event: "playlist.created",
      active: true,
    },
    {
      id: 2,
      name: "License Expiry Warning",
      description: "Send notification 7 days before license expires",
      event: "license.expiring",
      active: true,
    },
    {
      id: 3,
      name: "System Update Notice",
      description: "Notify all users before system updates",
      event: "system.update",
      active: false,
    },
  ]);

  const toggleRule = (ruleId: number) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, active: !rule.active } : rule
    ));
    
    toast({
      title: "Rule Updated",
      description: "Automation rule status has been updated",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Zap className="h-5 w-5 text-[#9b87f5]" />
            <h2>Automation Rules</h2>
          </div>
          <Button
            onClick={() => {
              toast({
                title: "Create Rule",
                description: "Rule creation feature coming soon",
              });
            }}
            className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Rule
          </Button>
        </div>

        <ScrollArea className="h-[400px] rounded-md border">
          <div className="p-4 space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{rule.name}</h3>
                    <p className="text-sm text-gray-500">{rule.description}</p>
                    <p className="text-xs text-gray-400">Event: {rule.event}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Edit Rule",
                          description: "Rule editing feature coming soon",
                        });
                      }}
                    >
                      <Settings2 className="h-4 w-4" />
                    </Button>
                    <Switch
                      checked={rule.active}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
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
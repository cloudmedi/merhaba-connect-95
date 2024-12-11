import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  CloudUpload,
  RefreshCw,
  Check,
  X,
  AlertCircle,
  Loader,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SystemUpdate {
  id: string;
  version: string;
  release_notes: string;
  update_type: 'major' | 'minor' | 'patch' | 'hotfix';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  created_at: string;
  published_at: string | null;
}

export function SystemUpdates() {
  const [version, setVersion] = useState("");
  const [releaseNotes, setReleaseNotes] = useState("");
  const [updateType, setUpdateType] = useState<SystemUpdate['update_type']>("minor");
  const [updates, setUpdates] = useState<SystemUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUpdate = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('system_updates')
        .insert([
          {
            version,
            release_notes: releaseNotes,
            update_type: updateType,
          }
        ])
        .select();

      if (error) throw error;

      toast.success('System update created successfully');
      setVersion("");
      setReleaseNotes("");
      setUpdateType("minor");
      
      // Refresh updates list
      fetchUpdates();
    } catch (error) {
      console.error('Error creating update:', error);
      toast.error('Failed to create system update');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('system_updates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUpdates(data);
    } catch (error) {
      console.error('Error fetching updates:', error);
      toast.error('Failed to fetch system updates');
    }
  };

  const getStatusIcon = (status: SystemUpdate['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: SystemUpdate['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Create System Update</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Version</label>
              <Input
                placeholder="e.g., 1.0.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Update Type</label>
              <Select value={updateType} onValueChange={(value: SystemUpdate['update_type']) => setUpdateType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                  <SelectItem value="patch">Patch</SelectItem>
                  <SelectItem value="hotfix">Hotfix</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Release Notes</label>
            <Textarea
              placeholder="Enter release notes..."
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
              rows={4}
            />
          </div>
          <Button
            onClick={handleCreateUpdate}
            disabled={isLoading || !version || !releaseNotes}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <CloudUpload className="mr-2 h-4 w-4" />
                Create Update
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Update History</h3>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {updates.map((update) => (
              <Card key={update.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Version {update.version}</h4>
                      <Badge variant="outline">{update.update_type}</Badge>
                      <Badge className={getStatusColor(update.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(update.status)}
                          {update.status}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(update.created_at).toLocaleDateString()}
                    </p>
                    {update.published_at && (
                      <p className="text-sm text-gray-500">
                        Published: {new Date(update.published_at).toLocaleDateString()}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">{update.release_notes}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
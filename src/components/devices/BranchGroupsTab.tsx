import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CreateGroupDialog } from "./branch-groups/CreateGroupDialog";
import { GroupList } from "./branch-groups/GroupList";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import DataTableLoader from "@/components/loaders/DataTableLoader";

export function BranchGroupsTab() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      console.log('Fetching groups...');
      const { data, error } = await supabase
        .from('branch_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched groups:', data);
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error("Gruplar yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchGroups();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('branch_groups_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'branch_groups'
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          fetchGroups();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Grup ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="ml-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Grup Oluştur
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <DataTableLoader />
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed">
            <img 
              src="/placeholder.svg" 
              alt="No groups" 
              className="w-32 h-32 mb-4 opacity-50"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Grup bulunamadı</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-sm">
              İlk grubunuzu oluşturarak başlayın. Tüm gruplarınızı buradan yönetebilirsiniz.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Grup Oluştur
            </Button>
          </div>
        ) : (
          <GroupList 
            groups={filteredGroups} 
            onRefresh={fetchGroups}
          />
        )}

        <CreateGroupDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={fetchGroups}
        />
      </div>
    </Card>
  );
}
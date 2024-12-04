import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface BranchGroup {
  id: string;
  name: string;
  description?: string;
  branch_group_assignments?: {
    branches: {
      id: string;
      name: string;
      location?: string;
    };
  }[];
  created_at?: string;
}

interface GroupListProps {
  groups: BranchGroup[];
}

export function GroupList({ groups }: GroupListProps) {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {groups.map((group) => {
          const branchCount = group.branch_group_assignments?.length || 0;
          const createdAt = group.created_at ? formatDistanceToNow(new Date(group.created_at), { addSuffix: true, locale: tr }) : '';

          return (
            <div
              key={group.id}
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-base">{group.name}</h3>
                  {group.description && (
                    <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                  )}
                </div>
                <Badge variant="secondary">
                  {branchCount} cihaz
                </Badge>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {createdAt} oluşturuldu
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
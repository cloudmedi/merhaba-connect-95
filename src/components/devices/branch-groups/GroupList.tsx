import { ScrollArea } from "@/components/ui/scroll-area";

interface BranchGroup {
  id: string;
  name: string;
  description?: string;
  branches?: {
    id: string;
    name: string;
    location?: string;
  }[];
}

interface GroupListProps {
  groups: BranchGroup[];
}

export function GroupList({ groups }: GroupListProps) {
  return (
    <ScrollArea className="h-[400px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="p-4 border rounded-lg hover:bg-accent"
          >
            <h3 className="font-medium">{group.name}</h3>
            {group.description && (
              <p className="text-sm text-gray-500 mt-1">{group.description}</p>
            )}
            <div className="mt-2">
              <span className="text-xs text-gray-500">
                {group.branches?.length || 0} branches
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
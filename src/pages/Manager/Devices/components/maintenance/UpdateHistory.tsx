import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Download, ArrowUpCircle } from "lucide-react";

interface Update {
  id: string;
  version: string;
  date: string;
  type: "major" | "minor" | "patch";
  changes: string[];
  status: "successful" | "failed" | "pending";
}

const updates: Update[] = [
  {
    id: "1",
    version: "2.1.0",
    date: "2024-02-25",
    type: "major",
    changes: [
      "Added new playback features",
      "Improved system stability",
      "Updated security protocols"
    ],
    status: "successful"
  },
  {
    id: "2",
    version: "2.0.1",
    date: "2024-02-20",
    type: "patch",
    changes: ["Bug fixes", "Performance improvements"],
    status: "successful"
  }
];

export function UpdateHistory() {
  return (
    <ScrollArea className="h-[600px] p-4">
      <div className="space-y-4">
        {updates.map((update) => (
          <Card key={update.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Version {update.version}</h3>
                  <Badge variant={update.type === "major" ? "destructive" : "default"}>
                    {update.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">{update.date}</p>
                <ul className="mt-4 space-y-2">
                  {update.changes.map((change, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <ArrowUpCircle className="h-4 w-4 text-green-500" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
              <Download className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
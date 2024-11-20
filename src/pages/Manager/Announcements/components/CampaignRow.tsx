import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Campaign } from "../types";
import { useState } from "react";
import { CampaignFiles } from "./CampaignFiles";

interface CampaignRowProps {
  campaign: Campaign;
}

export function CampaignRow({ campaign }: CampaignRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow className="group">
        <TableCell>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <div>
              <div className="font-medium">{campaign.name}</div>
              <div className="text-sm text-gray-500">{campaign.fileCount} files</div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          {campaign.schedule ? (
            <div>
              <div className="font-medium">{campaign.schedule}</div>
              <div className="text-sm text-gray-500">{campaign.scheduleTime}</div>
            </div>
          ) : (
            <Button variant="link" className="text-[#6E59A5] p-0 h-auto">
              Play Immediately
            </Button>
          )}
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={
              campaign.status === "pending"
                ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                : "bg-green-50 text-green-600 border-green-200"
            }
          >
            {campaign.status === "pending" ? "Pending" : "Playing"}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && campaign.files.length > 0 && (
        <TableRow>
          <TableCell colSpan={4} className="bg-gray-50">
            <CampaignFiles files={campaign.files} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
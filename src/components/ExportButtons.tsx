import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";

interface ExportButtonsProps {
  data: any[];
  columns: string[];
  fileName: string;
}

export function ExportButtons({ data, columns, fileName }: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => exportToExcel(data, fileName)}
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </Button>
      <Button
        variant="outline"
        onClick={() => exportToPDF(data, columns, fileName)}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
}
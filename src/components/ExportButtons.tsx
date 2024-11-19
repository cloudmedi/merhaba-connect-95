import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";
import { useToast } from "@/components/ui/use-toast";

interface ExportButtonsProps {
  data: any[];
  columns: string[];
  fileName: string;
}

export function ExportButtons({ data, columns, fileName }: ExportButtonsProps) {
  const { toast } = useToast();

  const handleExport = (type: 'excel' | 'pdf') => {
    try {
      if (type === 'excel') {
        exportToExcel(data, fileName);
      } else {
        exportToPDF(data, columns, fileName);
      }
      
      toast({
        title: "Export Successful",
        description: `Data has been exported to ${type.toUpperCase()} format`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => handleExport('excel')}
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </Button>
      <Button
        variant="outline"
        onClick={() => handleExport('pdf')}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
}
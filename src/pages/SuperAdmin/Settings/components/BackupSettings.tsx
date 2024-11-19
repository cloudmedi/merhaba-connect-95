import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Download, Upload, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function BackupSettings() {
  const [date, setDate] = useState<Date>();

  const handleBackup = () => {
    toast.success("Yedekleme başlatıldı");
  };

  const handleRestore = () => {
    toast.success("Geri yükleme başlatıldı");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Otomatik Yedekleme Ayarları</CardTitle>
          <CardDescription>
            Sistem verilerinizin otomatik olarak yedeklenmesi için bir plan
            oluşturun
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Yedekleme Sıklığı</label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue placeholder="Sıklık seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Saatlik</SelectItem>
                  <SelectItem value="daily">Günlük</SelectItem>
                  <SelectItem value="weekly">Haftalık</SelectItem>
                  <SelectItem value="monthly">Aylık</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Yedekleme Zamanı</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Tarih seçin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Yedekleme Konumu</label>
            <Select defaultValue="cloud">
              <SelectTrigger>
                <SelectValue placeholder="Konum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Yerel Depolama</SelectItem>
                <SelectItem value="cloud">Bulut Depolama</SelectItem>
                <SelectItem value="both">Her İkisi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manuel Yedekleme ve Geri Yükleme</CardTitle>
          <CardDescription>
            Sistem verilerinizi manuel olarak yedekleyin veya geri yükleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Button onClick={handleBackup} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Yedekleme Başlat
            </Button>
            <Button onClick={handleRestore} variant="outline" className="flex-1">
              <Upload className="mr-2 h-4 w-4" />
              Geri Yükleme
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Yedekleme Geçmişi</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Boyut</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2024-02-20 15:30</TableCell>
                  <TableCell>2.5 GB</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                      Başarılı
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-02-19 15:30</TableCell>
                  <TableCell>2.3 GB</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                      Başarılı
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
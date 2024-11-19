import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { FileText, Search } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "../../Music/components/TablePagination";

// Örnek veri - Gerçek API'den gelecek
const generateMockLogs = (count: number) => {
  const actions = [
    "Kullanıcı Girişi",
    "Playlist Oluşturma",
    "Müzik Ekleme",
    "Ayar Değişikliği",
    "Kullanıcı Ekleme",
    "Yetki Değişikliği"
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    user: `admin${Math.floor(Math.random() * 5) + 1}`,
    action: actions[Math.floor(Math.random() * actions.length)],
    details: `İşlem detayları ${i + 1}`,
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  }));
};

export function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [logType, setLogType] = useState("all");
  const itemsPerPage = 10;

  const logs = generateMockLogs(100);

  const filteredLogs = logs.filter(
    (log) =>
      (log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (logType === "all" || log.action.toLowerCase().includes(logType))
  );

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#9b87f5]" />
            <h2 className="text-lg font-semibold">Sistem Denetim Günlüğü</h2>
          </div>
          <div className="flex gap-2">
            <Select value={logType} onValueChange={setLogType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Log tipi seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Loglar</SelectItem>
                <SelectItem value="giriş">Giriş Logları</SelectItem>
                <SelectItem value="playlist">Playlist Logları</SelectItem>
                <SelectItem value="müzik">Müzik Logları</SelectItem>
                <SelectItem value="ayar">Ayar Logları</SelectItem>
                <SelectItem value="güvenlik">Güvenlik Logları</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </div>

        <ScrollArea className="h-[600px] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>İşlem</TableHead>
                <TableHead>Detaylar</TableHead>
                <TableHead>IP Adresi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString("tr-TR")}
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.action.includes("Giriş")
                          ? "bg-blue-100 text-blue-800"
                          : log.action.includes("Playlist")
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell>{log.details}</TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
        />
      </div>
    </Card>
  );
}
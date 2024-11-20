import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types/auth";
import { format } from "date-fns";

interface UserHistoryDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Örnek veri - Gerçek API'den gelecek
const generateMockHistory = (userId: string) => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    action: i % 3 === 0 ? "Giriş Yapıldı" : i % 3 === 1 ? "Playlist Değiştirildi" : "Ayarlar Güncellendi",
    details: i % 3 === 0 
      ? "Windows Player üzerinden giriş yapıldı" 
      : i % 3 === 1 
      ? "Yaz Şarkıları playlistine geçiş yapıldı" 
      : "Ses ayarları güncellendi",
    timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  }));
};

export function UserHistoryDialog({ user, open, onOpenChange }: UserHistoryDialogProps) {
  const history = generateMockHistory(user.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Kullanıcı Geçmişi - {user.firstName} {user.lastName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>İşlem</TableHead>
                <TableHead>Detaylar</TableHead>
                <TableHead>IP Adresi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(item.timestamp), "dd MMM yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.action === "Giriş Yapıldı"
                          ? "bg-blue-100 text-blue-800"
                          : item.action === "Playlist Değiştirildi"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {item.action}
                    </span>
                  </TableCell>
                  <TableCell>{item.details}</TableCell>
                  <TableCell>{item.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
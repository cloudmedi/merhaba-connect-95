import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Copy, Plus, Trash2, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  rateLimit: number;
  requestCount: number;
}

// Mock data for API usage statistics
const mockUsageData = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
  requests: Math.floor(Math.random() * 1000),
})).reverse();

export function ApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production API Key",
      key: "mk_prod_123456789",
      createdAt: "2024-02-20",
      lastUsed: "2024-02-25",
      rateLimit: 1000,
      requestCount: 850,
    },
    {
      id: "2",
      name: "Development API Key",
      key: "mk_dev_987654321",
      createdAt: "2024-02-15",
      lastUsed: "2024-02-24",
      rateLimit: 500,
      requestCount: 320,
    },
  ]);

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API anahtarı panoya kopyalandı");
  };

  const deleteKey = (id: string) => {
    setKeys(keys.filter((key) => key.id !== id));
    toast.success("API anahtarı başarıyla silindi");
  };

  const generateNewKey = () => {
    const newKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Yeni API Anahtarı",
      key: `mk_${Math.random().toString(36).substr(2, 15)}`,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: "-",
      rateLimit: 1000,
      requestCount: 0,
    };
    setKeys([...keys, newKey]);
    toast.success("Yeni API anahtarı oluşturuldu");
  };

  const updateRateLimit = (id: string, limit: number) => {
    setKeys(keys.map(key => 
      key.id === id ? { ...key, rateLimit: limit } : key
    ));
    toast.success("Rate limit güncellendi");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="keys" className="w-full">
        <TabsList>
          <TabsTrigger value="keys">API Anahtarları</TabsTrigger>
          <TabsTrigger value="limits">Rate Limiting</TabsTrigger>
          <TabsTrigger value="stats">Kullanım İstatistikleri</TabsTrigger>
        </TabsList>

        <TabsContent value="keys">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">API Anahtarları</h2>
              <Button onClick={generateNewKey}>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Anahtar Oluştur
              </Button>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>İsim</TableHead>
                    <TableHead>API Anahtarı</TableHead>
                    <TableHead>Oluşturulma</TableHead>
                    <TableHead>Son Kullanım</TableHead>
                    <TableHead>Rate Limit</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell>{key.name}</TableCell>
                      <TableCell className="font-mono">{key.key}</TableCell>
                      <TableCell>{key.createdAt}</TableCell>
                      <TableCell>{key.lastUsed}</TableCell>
                      <TableCell>{key.rateLimit}/saat</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(key.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteKey(key.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="limits">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Rate Limiting Ayarları</h2>
                <Settings2 className="h-5 w-5 text-gray-500" />
              </div>
              
              {keys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{key.name}</h3>
                    <p className="text-sm text-gray-500">{key.key}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Select
                      defaultValue={key.rateLimit.toString()}
                      onValueChange={(value) => updateRateLimit(key.id, Number(value))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Rate limit seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100/saat</SelectItem>
                        <SelectItem value="500">500/saat</SelectItem>
                        <SelectItem value="1000">1000/saat</SelectItem>
                        <SelectItem value="5000">5000/saat</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-gray-500">
                      Kullanım: {key.requestCount}/{key.rateLimit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">API Kullanım İstatistikleri</h2>
                <Select defaultValue="7">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Süre seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Son 7 gün</SelectItem>
                    <SelectItem value="30">Son 30 gün</SelectItem>
                    <SelectItem value="90">Son 90 gün</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="requests" 
                      stroke="#9b87f5" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-gray-500">Toplam İstek</h3>
                  <p className="text-2xl font-bold">45,231</p>
                  <span className="text-sm text-green-500">↑ 12% artış</span>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-gray-500">Ortalama Yanıt Süresi</h3>
                  <p className="text-2xl font-bold">124ms</p>
                  <span className="text-sm text-red-500">↓ 5% düşüş</span>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-gray-500">Başarı Oranı</h3>
                  <p className="text-2xl font-bold">99.9%</p>
                  <span className="text-sm text-green-500">↑ 0.1% artış</span>
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
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
import { Copy, Plus, Trash2 } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
}

export function ApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production API Key",
      key: "mk_prod_123456789",
      createdAt: "2024-02-20",
      lastUsed: "2024-02-25",
    },
    {
      id: "2",
      name: "Development API Key",
      key: "mk_dev_987654321",
      createdAt: "2024-02-15",
      lastUsed: "2024-02-24",
    },
  ]);

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const deleteKey = (id: string) => {
    setKeys(keys.filter((key) => key.id !== id));
    toast.success("API key deleted successfully");
  };

  const generateNewKey = () => {
    const newKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: "New API Key",
      key: `mk_${Math.random().toString(36).substr(2, 15)}`,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: "-",
    };
    setKeys([...keys, newKey]);
    toast.success("New API key generated");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">API Keys</h2>
        <Button onClick={generateNewKey}>
          <Plus className="h-4 w-4 mr-2" />
          Generate New Key
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>API Key</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key) => (
              <TableRow key={key.id}>
                <TableCell>{key.name}</TableCell>
                <TableCell className="font-mono">{key.key}</TableCell>
                <TableCell>{key.createdAt}</TableCell>
                <TableCell>{key.lastUsed}</TableCell>
                <TableCell className="text-right">
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
    </div>
  );
}
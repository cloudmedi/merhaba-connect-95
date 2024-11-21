import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useDevices } from "../hooks/useDevices";
import { useLocations } from "../hooks/useLocations";
import { toast } from "sonner";

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDeviceDialog({ open, onOpenChange }: AddDeviceDialogProps) {
  const [deviceName, setDeviceName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<"player" | "display" | "controller">("player");
  const [token, setToken] = useState("");
  const { createDevice } = useDevices();
  const { data: locations = [], isLoading: isLoadingLocations } = useLocations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deviceName) {
      toast.error('Lütfen cihaz adı girin');
      return;
    }

    await createDevice.mutateAsync({
      name: deviceName,
      location: location,
      category,
      status: 'offline',
      system_info: {},
      schedule: {},
      token
    });

    onOpenChange(false);
    setDeviceName("");
    setLocation("");
    setCategory("player");
    setToken("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Cihaz Ekle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deviceName">Cihaz Adı</Label>
            <Input
              id="deviceName"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="Cihaz adını girin"
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Konum</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Konum seçin" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
                <SelectItem value="new">Yeni Konum</SelectItem>
              </SelectContent>
            </Select>
            {location === "new" && (
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Yeni konum girin"
                className="mt-2"
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Cihaz Tipi</Label>
            <Select value={category} onValueChange={(value: "player" | "display" | "controller") => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Cihaz tipini seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="player">Player</SelectItem>
                <SelectItem value="display">Display</SelectItem>
                <SelectItem value="controller">Controller</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="token">Eşleştirme Kodu</Label>
            <Input
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Windows Player'dan 6 haneli kodu girin"
              className="w-full"
              maxLength={6}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createDevice.isPending}>
              {createDevice.isPending ? "Ekleniyor..." : "Cihaz Ekle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
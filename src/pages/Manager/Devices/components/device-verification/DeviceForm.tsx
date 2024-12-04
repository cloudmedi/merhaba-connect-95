import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DeviceFormProps {
  name: string;
  setName: (value: string) => void;
  category: "player" | "display" | "controller";
  setCategory: (value: "player" | "display" | "controller") => void;
  location: string;
  setLocation: (value: string) => void;
  token: string;
  setToken: (value: string) => void;
  ipAddress: string;
  setIpAddress: (value: string) => void;
  isVerifying: boolean;
  onTokenChange: (token: string) => void;
}

export function DeviceForm({
  name,
  setName,
  category,
  setCategory,
  location,
  setLocation,
  token,
  setToken,
  ipAddress,
  setIpAddress,
  isVerifying,
  onTokenChange
}: DeviceFormProps) {
  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToken = e.target.value;
    setToken(newToken);
    
    if (newToken.length === 6) {
      onTokenChange(newToken);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="token">Device Token</Label>
        <Input
          id="token"
          value={token}
          onChange={handleTokenChange}
          placeholder="Enter device token"
          required
          disabled={isVerifying}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Device Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter device name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Device Type</Label>
        <Select value={category} onValueChange={(value: "player" | "display" | "controller") => setCategory(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select device type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="player">Player</SelectItem>
            <SelectItem value="display">Display</SelectItem>
            <SelectItem value="controller">Controller</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter device location"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ipAddress">IP Address</Label>
        <Input
          id="ipAddress"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          placeholder="Enter IP address"
        />
      </div>
    </>
  );
}
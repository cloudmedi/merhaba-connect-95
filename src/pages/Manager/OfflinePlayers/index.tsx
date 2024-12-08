import React from 'react';
import { Card } from '@/components/ui/card';
import { PlaylistSync } from '@/renderer/components/PlaylistSync';

export default function OfflinePlayers() {
  return (
    <div className="container mx-auto p-6">
      <PlaylistSync />
    </div>
  );
}
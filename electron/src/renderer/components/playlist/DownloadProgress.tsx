import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';

interface DownloadProgressProps {
  progress: { [key: string]: number };
}

export function DownloadProgress({ progress }: DownloadProgressProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-medium mb-4">İndirme Durumu</h4>
        <div className="space-y-2">
          {Object.entries(progress).map(([songId, value]) => (
            <div key={songId} className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Şarkı ID: {songId}</span>
                <span>{Math.round(value)}%</span>
              </div>
              <Progress value={value} className="h-1" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";

interface SongStatistic {
  song_id: string;
  song_title: string;
  artist: string | null;
  unique_branches: number;
  unique_devices: number;
  total_plays: number;
  last_played: string | null;
  avg_daily_plays: number;
}

export function SongStatistics() {
  const { data: statistics = [], isLoading, refetch } = useQuery({
    queryKey: ['song-statistics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('song_play_statistics')
        .select('*')
        .order('total_plays', { ascending: false });

      if (error) throw error;
      return data as SongStatistic[];
    }
  });

  useEffect(() => {
    // Subscribe to realtime changes
    const channel = supabase
      .channel('song-stats-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'song_play_history',
      }, () => {
        refetch();
        toast.info("Müzik istatistikleri güncellendi");
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Şarkı Çalma İstatistikleri</h2>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Şarkı</TableHead>
              <TableHead>Sanatçı</TableHead>
              <TableHead className="text-right">Toplam Çalma</TableHead>
              <TableHead className="text-right">Günlük Ort.</TableHead>
              <TableHead className="text-right">Benzersiz Şubeler</TableHead>
              <TableHead className="text-right">Benzersiz Cihazlar</TableHead>
              <TableHead>Son Çalma</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statistics.map((stat) => (
              <TableRow key={stat.song_id}>
                <TableCell className="font-medium">{stat.song_title}</TableCell>
                <TableCell>{stat.artist || '-'}</TableCell>
                <TableCell className="text-right">{stat.total_plays}</TableCell>
                <TableCell className="text-right">{stat.avg_daily_plays.toFixed(1)}</TableCell>
                <TableCell className="text-right">{stat.unique_branches}</TableCell>
                <TableCell className="text-right">{stat.unique_devices}</TableCell>
                <TableCell>
                  {stat.last_played 
                    ? format(new Date(stat.last_played), 'dd/MM/yyyy HH:mm')
                    : '-'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
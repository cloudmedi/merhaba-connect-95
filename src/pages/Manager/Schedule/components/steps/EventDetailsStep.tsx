import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { EventCategory } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface EventDetailsStepProps {
  formData: {
    title: string;
    playlistId: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    category: EventCategory;
  };
  onFormDataChange: (data: Partial<EventDetailsStepProps['formData']>) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function EventDetailsStep({ formData, onFormDataChange, onNext, onCancel }: EventDetailsStepProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: playlists = [], isLoading } = useQuery({
    queryKey: ['available-playlists', searchQuery],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error('No profile found');

      const query = supabase
        .from('playlists')
        .select(`
          id,
          name,
          artwork_url,
          is_public,
          company_id
        `)
        .ilike('name', `%${searchQuery}%`);

      if (profile.company_id) {
        query.or(`is_public.eq.true,company_id.eq.${profile.company_id}`);
      } else {
        query.or('is_public.eq.true');
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>{t('schedule.createEvent.details.eventTitle')}</Label>
        <Input
          placeholder={t('schedule.createEvent.details.eventTitlePlaceholder')}
          value={formData.title}
          onChange={(e) => onFormDataChange({ title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('schedule.createEvent.details.category')}</Label>
        <Select
          value={formData.category}
          onValueChange={(value: EventCategory) => onFormDataChange({ category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('schedule.createEvent.details.selectCategory')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Special Promotion">Special Promotion</SelectItem>
            <SelectItem value="Holiday Music">Holiday Music</SelectItem>
            <SelectItem value="Regular Playlist">Regular Playlist</SelectItem>
            <SelectItem value="Background Music">Background Music</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t('schedule.createEvent.details.selectPlaylist')}</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('schedule.createEvent.details.searchPlaylists')}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[200px] border rounded-md">
          <div className="p-4 space-y-2">
            {isLoading ? (
              <div className="text-center text-gray-500">{t('schedule.createEvent.details.loadingPlaylists')}</div>
            ) : playlists.length === 0 ? (
              <div className="text-center text-gray-500">{t('schedule.createEvent.details.noPlaylists')}</div>
            ) : (
              playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    formData.playlistId === playlist.id
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => onFormDataChange({ playlistId: playlist.id })}
                >
                  <div className="font-medium">{playlist.name}</div>
                  <div className="text-sm text-gray-500">
                    {playlist.is_public 
                      ? t('schedule.createEvent.details.publicPlaylist')
                      : t('schedule.createEvent.details.companyPlaylist')
                    }
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('schedule.createEvent.details.startDate')}</Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => onFormDataChange({ startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('schedule.createEvent.details.startTime')}</Label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => onFormDataChange({ startTime: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('schedule.createEvent.details.endDate')}</Label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => onFormDataChange({ endDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('schedule.createEvent.details.endTime')}</Label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => onFormDataChange({ endTime: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          {t('schedule.createEvent.buttons.cancel')}
        </Button>
        <Button 
          onClick={onNext} 
          className="bg-[#6E59A5] hover:bg-[#5a478a] text-white"
          disabled={!formData.title || !formData.playlistId || !formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime}
        >
          {t('schedule.createEvent.buttons.next')}
        </Button>
      </div>
    </div>
  );
}

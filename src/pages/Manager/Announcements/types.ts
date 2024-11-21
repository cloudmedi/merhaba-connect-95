export interface Campaign {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "playing";
  start_date?: string;
  end_date?: string;
  repeat_type: string;
  repeat_interval: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  announcement_files: CampaignFile[];
  profiles: {
    first_name: string | null;
    last_name: string | null;
  };
}

export interface CampaignFile {
  id: string;
  file_name: string;
  file_url: string;
  duration?: number;
}

export interface FileWithPreview {
  file: File;
  previewUrl: string;
  isPlaying: boolean;
  duration?: number;
}
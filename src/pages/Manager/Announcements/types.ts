export interface Campaign {
  id: string;
  title: string;
  name?: string;
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
  schedule?: string;
  scheduleTime?: string;
  fileCount?: number;
  files?: CampaignFile[];
}

export interface CampaignFile {
  id: string;
  file_name: string;
  file_url: string;
  duration?: number;
  name?: string;
  size?: string;
}

export interface FileWithPreview {
  file: File;
  previewUrl: string;
  isPlaying: boolean;
  duration?: number;
}

export interface CampaignFormData {
  title: string;
  description: string;
  files: File[];
  startDate: string;
  endDate: string;
  repeatType: string;
  repeatInterval: number;
  devices: string[];
}

export interface Branch {
  id: string;
  name: string;
  location: string | null;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
}
export interface Campaign {
  id: number;
  name: string;
  fileCount: number;
  schedule?: string;
  scheduleTime?: string;
  status: "pending" | "playing";
  files: CampaignFile[];
}

export interface CampaignFile {
  id: number;
  name: string;
  size: string;
  duration: string;
}

export interface FileWithPreview {
  file: File;
  previewUrl: string;
  isPlaying: boolean;
  duration?: number;
}

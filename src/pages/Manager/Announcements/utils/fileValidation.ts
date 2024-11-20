import { toast } from "sonner";

export const validateAudioFile = async (
  file: File,
  maxFileSize: number,
  maxDuration: number
): Promise<boolean> => {
  if (!file.type.startsWith('audio/')) {
    toast.error(`${file.name} ses dosyası değil`);
    return false;
  }

  if (file.size > maxFileSize * 1024 * 1024) {
    toast.error(`${file.name} çok büyük (max ${maxFileSize}MB)`);
    return false;
  }

  // Check audio duration
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      if (audio.duration > maxDuration) {
        toast.error(`${file.name} çok uzun (max ${maxDuration / 60} dakika)`);
        resolve(false);
      }
      resolve(true);
    };
  });
};
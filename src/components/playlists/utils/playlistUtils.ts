export const calculateTotalDuration = (songs: any[]) => {
  if (!songs || songs.length === 0) return "0 min";
  
  const totalSeconds = songs.reduce((acc: number, song: any) => {
    return acc + (song.duration || 0);
  }, 0);
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
};

export const formatDuration = (duration?: number) => {
  if (!duration) return "0:00";
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
export const getOptimizedImageUrl = (url?: string) => {
  if (!url) return "/placeholder.svg";
  if (!url.includes('b-cdn.net')) return url;
  return `${url}?width=400&quality=85&format=webp`;
};

export const getAudioUrl = (song?: { file_url?: string; bunny_id?: string }) => {
  if (!song?.file_url) {
    console.error('No file_url provided for song:', song);
    return '';
  }
  
  if (song.file_url.startsWith('http')) {
    return song.file_url;
  }
  
  if (song.bunny_id) {
    return `https://cloud-media.b-cdn.net/${song.bunny_id}`;
  }
  
  return `https://cloud-media.b-cdn.net/${song.file_url}`;
};
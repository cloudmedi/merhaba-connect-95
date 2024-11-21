export const getArtworkUrl = (url: string | null | undefined) => {
  if (!url) return "/placeholder.svg";
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  if (!url.includes('://')) {
    return `https://cloud-media.b-cdn.net/${url}`;
  }
  
  return "/placeholder.svg";
};
export const getOptimizedImageUrl = (url: string) => {
  if (!url || !url.includes('b-cdn.net')) return url;
  return `${url}?width=400&quality=85&format=webp`;
};
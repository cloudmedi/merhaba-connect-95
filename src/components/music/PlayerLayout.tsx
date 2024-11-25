import { cn } from "@/lib/utils";

interface PlayerLayoutProps {
  artwork: string;
  children: React.ReactNode;
  className?: string;
}

export function PlayerLayout({ artwork, children, className }: PlayerLayoutProps) {
  const getOptimizedImageUrl = (url: string) => {
    if (!url || !url.includes('b-cdn.net')) return url;
    return `${url}?width=400&quality=85&format=webp`;
  };

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-[100] animate-slide-up", className)}>
      {/* Enhanced blurred background with artwork */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${getOptimizedImageUrl(artwork)})`,
          filter: 'blur(80px) saturate(180%)',
          transform: 'scale(1.2)',
          opacity: '0.15'
        }}
      />
      
      {/* Improved gradient overlay with better contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/95 to-[#121212]/90" />

      {/* Content container with better spacing */}
      <div className="relative px-4 md:px-8 py-4 md:py-5 flex flex-col md:flex-row items-center gap-4 md:gap-8 max-w-screen-2xl mx-auto">
        {children}
      </div>
    </div>
  );
}
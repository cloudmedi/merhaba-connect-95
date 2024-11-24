import React from 'react';
import ContentLoader from 'react-content-loader';

export function HeroLoader() {
  return (
    <div className="mb-12 rounded-lg overflow-hidden h-[300px] bg-gray-50/50">
      <ContentLoader
        speed={2}
        width={1200}
        height={300}
        viewBox="0 0 1200 300"
        backgroundColor="#f5f5f5"
        foregroundColor="#eeeeee"
        className="w-full h-full"
      >
        {/* Featured Playlist Text */}
        <rect x="40" y="80" rx="4" ry="4" width="300" height="36" />
        
        {/* Playlist Title */}
        <rect x="40" y="140" rx="4" ry="4" width="200" height="24" />
        
        {/* Button */}
        <rect x="40" y="190" rx="20" ry="20" width="120" height="40" />
        
        {/* Artwork */}
        <rect x="800" y="40" rx="8" ry="8" width="220" height="220" />
      </ContentLoader>
    </div>
  );
}
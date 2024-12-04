import React from 'react';
import ContentLoader from 'react-content-loader';

interface CatalogLoaderProps {
  count?: number;
}

export default function CatalogLoader({ count = 6 }: CatalogLoaderProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-4">
          <ContentLoader
            speed={2}
            width="100%"
            height={240}
            viewBox="0 0 200 240"
            backgroundColor="#f5f5f5"
            foregroundColor="#eeeeee"
          >
            {/* Artwork */}
            <rect x="0" y="0" rx="8" ry="8" width="200" height="200" />
            
            {/* Title */}
            <rect x="0" y="210" rx="4" ry="4" width="140" height="12" />
            
            {/* Subtitle */}
            <rect x="0" y="230" rx="3" ry="3" width="80" height="10" />
          </ContentLoader>
        </div>
      ))}
    </div>
  );
}
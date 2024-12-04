import React from 'react';
import ContentLoader from 'react-content-loader';

interface CatalogLoaderProps {
  count?: number;
}

export default function CatalogLoader({ count = 6 }: CatalogLoaderProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {[...Array(count)].map((_, i) => (
        <ContentLoader
          key={i}
          speed={2}
          width={200}
          height={250}
          viewBox="0 0 200 250"
          backgroundColor="#f3f4f6"
          foregroundColor="#e5e7eb"
        >
          {/* Artwork */}
          <rect x="0" y="0" rx="8" ry="8" width="200" height="200" />
          
          {/* Title */}
          <rect x="0" y="210" rx="4" ry="4" width="140" height="16" />
          
          {/* Metadata */}
          <rect x="0" y="235" rx="3" ry="3" width="80" height="12" />
        </ContentLoader>
      ))}
    </div>
  );
}
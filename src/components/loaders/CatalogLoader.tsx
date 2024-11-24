import React from 'react';
import ContentLoader from 'react-content-loader';

interface CatalogLoaderProps {
  count: number;
}

const CatalogLoader = ({ count }: CatalogLoaderProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {[...Array(count)].map((_, index) => (
      <ContentLoader
        key={index}
        speed={2}
        width={200}
        height={280}
        viewBox="0 0 200 280"
        backgroundColor="#f5f5f5"
        foregroundColor="#eeeeee"
        className="w-full"
      >
        {/* Artwork placeholder */}
        <rect x="0" y="0" rx="8" ry="8" width="200" height="200" />
        
        {/* Title placeholder */}
        <rect x="0" y="216" rx="4" ry="4" width="140" height="16" />
        
        {/* Subtitle placeholders */}
        <rect x="0" y="244" rx="3" ry="3" width="80" height="12" />
        <rect x="90" y="244" rx="3" ry="3" width="80" height="12" />
      </ContentLoader>
    ))}
  </div>
);

export default CatalogLoader;
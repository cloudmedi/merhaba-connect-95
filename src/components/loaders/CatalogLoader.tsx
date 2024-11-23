import React from 'react';
import ContentLoader from 'react-content-loader';

interface CatalogLoaderProps {
  count?: number;
  backgroundColor?: string;
  foregroundColor?: string;
}

const CatalogLoader = ({ count = 6, backgroundColor = "#f3f4f6", foregroundColor = "#e5e7eb" }: CatalogLoaderProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
    {[...Array(count)].map((_, index) => (
      <ContentLoader
        key={index}
        speed={2}
        width={200}
        height={300}
        viewBox="0 0 200 300"
        backgroundColor={backgroundColor}
        foregroundColor={foregroundColor}
        className="w-full"
      >
        {/* Image placeholder */}
        <rect x="0" y="0" rx="8" ry="8" width="200" height="200" />
        {/* Title placeholder */}
        <rect x="0" y="220" rx="4" ry="4" width="160" height="20" />
        {/* Tags placeholder */}
        <rect x="0" y="260" rx="12" ry="12" width="80" height="24" />
        <rect x="90" y="260" rx="12" ry="12" width="80" height="24" />
      </ContentLoader>
    ))}
  </div>
);

export default CatalogLoader;
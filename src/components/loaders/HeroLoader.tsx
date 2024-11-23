import React from 'react';
import ContentLoader from 'react-content-loader';

export function HeroLoader() {
  return (
    <div className="mb-12 rounded-lg overflow-hidden h-[300px] bg-gray-100">
      <ContentLoader
        speed={2}
        width={1200}
        height={300}
        viewBox="0 0 1200 300"
        backgroundColor="#f3f4f6"
        foregroundColor="#e5e7eb"
        className="w-full h-full"
      >
        {/* Title */}
        <rect x="40" y="80" rx="4" ry="4" width="400" height="40" />
        {/* Subtitle */}
        <rect x="40" y="140" rx="4" ry="4" width="300" height="24" />
        {/* Button */}
        <rect x="40" y="200" rx="20" ry="20" width="150" height="40" />
        {/* Image */}
        <rect x="800" y="40" rx="8" ry="8" width="300" height="220" />
      </ContentLoader>
    </div>
  );
}
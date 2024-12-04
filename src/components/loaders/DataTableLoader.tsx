import React from 'react';
import ContentLoader from 'react-content-loader';

export default function DataTableLoader() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <ContentLoader
        speed={2}
        width="100%"
        height={40}
        viewBox="0 0 1200 40"
        backgroundColor="#f5f5f5"
        foregroundColor="#eeeeee"
      >
        <rect x="0" y="0" rx="4" ry="4" width="1200" height="40" />
      </ContentLoader>

      {/* Rows */}
      {[...Array(5)].map((_, index) => (
        <ContentLoader
          key={index}
          speed={2}
          width="100%"
          height={60}
          viewBox="0 0 1200 60"
          backgroundColor="#f5f5f5"
          foregroundColor="#eeeeee"
        >
          <rect x="0" y="10" rx="4" ry="4" width="40" height="40" />
          <rect x="60" y="20" rx="4" ry="4" width="200" height="20" />
          <rect x="280" y="20" rx="4" ry="4" width="150" height="20" />
          <rect x="450" y="20" rx="4" ry="4" width="100" height="20" />
          <rect x="570" y="20" rx="4" ry="4" width="80" height="20" />
          <rect x="1100" y="15" rx="4" ry="4" width="30" height="30" />
          <rect x="1150" y="15" rx="4" ry="4" width="30" height="30" />
        </ContentLoader>
      ))}
    </div>
  );
}
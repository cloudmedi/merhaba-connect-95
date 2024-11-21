import React from 'react';
import ContentLoader from 'react-content-loader';

export const DataTableLoader = () => {
  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <ContentLoader
          speed={2}
          width={1200}
          height={500}
          viewBox="0 0 1200 500"
          backgroundColor="#f3f4f6"
          foregroundColor="#e5e7eb"
        >
          {/* Header */}
          <rect x="0" y="0" rx="0" ry="0" width="1200" height="50" />
          
          {/* Table Rows */}
          {[...Array(8)].map((_, i) => (
            <React.Fragment key={i}>
              <circle cx="45" cy={100 + (i * 55)} r="25" />
              <rect x="90" y={85 + (i * 55)} rx="4" ry="4" width="180" height="12" />
              <rect x="90" y={102 + (i * 55)} rx="3" ry="3" width="120" height="10" />
              <rect x="300" y={90 + (i * 55)} rx="4" ry="4" width="160" height="12" />
              <rect x="500" y={90 + (i * 55)} rx="4" ry="4" width="100" height="12" />
              <rect x="640" y={86 + (i * 55)} rx="12" ry="12" width="80" height="20" />
              <rect x="760" y={86 + (i * 55)} rx="12" ry="12" width="90" height="20" />
              <rect x="890" y={90 + (i * 55)} rx="4" ry="4" width="120" height="12" />
              <rect x="1050" y={86 + (i * 55)} rx="4" ry="4" width="100" height="20" />
            </React.Fragment>
          ))}
        </ContentLoader>
      </div>
    </div>
  );
};
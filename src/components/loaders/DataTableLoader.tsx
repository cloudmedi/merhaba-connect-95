import React from 'react';
import ContentLoader from 'react-content-loader';

const DataTableLoader = () => {
  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <ContentLoader
          speed={2}
          width={1200}
          height={400}
          viewBox="0 0 1200 400"
          backgroundColor="#f3f4f6"
          foregroundColor="#e5e7eb"
        >
          {/* Header */}
          <rect x="0" y="0" rx="0" ry="0" width="1200" height="40" />
          
          {/* Rows */}
          {[...Array(5)].map((_, i) => (
            <React.Fragment key={i}>
              <rect 
                x="20" 
                y={60 + (i * 70)} 
                rx="8" 
                ry="8" 
                width="40" 
                height="40" 
              />
              <rect 
                x="80" 
                y={70 + (i * 70)} 
                rx="4" 
                ry="4" 
                width="200" 
                height="20" 
              />
              <rect 
                x="300" 
                y={70 + (i * 70)} 
                rx="4" 
                ry="4" 
                width="150" 
                height="20" 
              />
              <rect 
                x="470" 
                y={70 + (i * 70)} 
                rx="4" 
                ry="4" 
                width="100" 
                height="20" 
              />
              <rect 
                x="590" 
                y={70 + (i * 70)} 
                rx="4" 
                ry="4" 
                width="100" 
                height="20" 
              />
              <rect 
                x="710" 
                y={70 + (i * 70)} 
                rx="4" 
                ry="4" 
                width="150" 
                height="20" 
              />
              <rect 
                x="880" 
                y={70 + (i * 70)} 
                rx="4" 
                ry="4" 
                width="100" 
                height="20" 
              />
            </React.Fragment>
          ))}
        </ContentLoader>
      </div>
    </div>
  );
};

export default DataTableLoader;
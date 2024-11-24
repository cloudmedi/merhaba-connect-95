import React from 'react';
import ContentLoader from 'react-content-loader';

export function PlaylistDetailLoader() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-start gap-8">
        {/* Artwork Placeholder */}
        <ContentLoader
          speed={2}
          width={128}
          height={128}
          viewBox="0 0 128 128"
          backgroundColor="#f5f5f5"
          foregroundColor="#eeeeee"
          className="rounded-lg skeleton-loading"
        >
          <rect x="0" y="0" rx="8" ry="8" width="128" height="128" />
        </ContentLoader>

        {/* Title and Info */}
        <ContentLoader
          speed={2}
          width={300}
          height={128}
          viewBox="0 0 300 128"
          backgroundColor="#f5f5f5"
          foregroundColor="#eeeeee"
          className="skeleton-loading"
        >
          <rect x="0" y="0" rx="4" ry="4" width="200" height="32" />
          <rect x="0" y="48" rx="4" ry="4" width="280" height="20" />
          <rect x="0" y="88" rx="20" ry="20" width="120" height="40" />
        </ContentLoader>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 text-xs font-medium text-gray-500 uppercase tracking-wider pb-4 border-b">
        <div className="col-span-1">#</div>
        <div className="col-span-5">TITLE</div>
        <div className="col-span-4">ARTIST</div>
        <div className="col-span-2 text-right">DURATION</div>
      </div>

      {/* Song List */}
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <ContentLoader
            key={index}
            speed={2}
            width={1200}
            height={60}
            viewBox="0 0 1200 60"
            backgroundColor="#f5f5f5"
            foregroundColor="#eeeeee"
            className="w-full skeleton-loading"
          >
            <rect x="0" y="15" rx="4" ry="4" width="20" height="20" />
            <rect x="100" y="15" rx="4" ry="4" width="200" height="20" />
            <rect x="500" y="15" rx="4" ry="4" width="150" height="20" />
            <rect x="1100" y="15" rx="4" ry="4" width="60" height="20" />
          </ContentLoader>
        ))}
      </div>
    </div>
  );
}
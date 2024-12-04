import React from 'react';
import ContentLoader from 'react-content-loader';
import { ArrowLeft } from "lucide-react";

export function PlaylistDetailLoader() {
  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="p-6 space-y-8">
        {/* Back button */}
        <div className="flex items-center gap-2 text-gray-400">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Media Library</span>
        </div>

        {/* Hero section */}
        <div className="flex items-start gap-8">
          {/* Artwork skeleton */}
          <ContentLoader
            speed={2}
            width={192}
            height={192}
            viewBox="0 0 192 192"
            backgroundColor="#f5f5f5"
            foregroundColor="#eeeeee"
          >
            <rect x="0" y="0" rx="8" ry="8" width="192" height="192" />
          </ContentLoader>
          
          <div className="space-y-4 flex-1">
            {/* Title and metadata */}
            <ContentLoader
              speed={2}
              width={400}
              height={100}
              viewBox="0 0 400 100"
              backgroundColor="#f5f5f5"
              foregroundColor="#eeeeee"
            >
              {/* Title */}
              <rect x="0" y="0" rx="4" ry="4" width="300" height="24" />
              
              {/* Metadata */}
              <rect x="0" y="40" rx="4" ry="4" width="200" height="16" />
              
              {/* Push button */}
              <rect x="0" y="70" rx="20" ry="20" width="100" height="30" />
            </ContentLoader>
          </div>
        </div>

        {/* Songs list */}
        <div className="space-y-4">
          {/* Table header */}
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

          {/* Song rows */}
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
              <rect x="60" y="10" rx="4" ry="4" width="40" height="40" />
              <rect x="120" y="20" rx="4" ry="4" width="200" height="20" />
              <rect x="340" y="20" rx="4" ry="4" width="150" height="20" />
              <rect x="510" y="20" rx="4" ry="4" width="100" height="20" />
            </ContentLoader>
          ))}
        </div>
      </div>
    </div>
  );
}
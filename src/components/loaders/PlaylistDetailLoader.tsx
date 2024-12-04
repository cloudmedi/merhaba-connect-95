import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export function PlaylistDetailLoader() {
  return (
    <div className="min-h-screen bg-white rounded-lg shadow-sm">
      <div className="p-6 space-y-8">
        <div className="flex items-center gap-2 text-gray-500">
          <Skeleton className="w-24 h-4" />
        </div>

        <div className="flex items-start gap-8">
          {/* Artwork placeholder */}
          <Skeleton className="w-32 h-32 rounded-lg" />
          
          <div className="space-y-3">
            {/* Title placeholder */}
            <Skeleton className="w-48 h-8" />
            
            {/* Metadata placeholders */}
            <div className="flex items-center gap-2">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>
            
            {/* Button placeholder */}
            <Skeleton className="w-24 h-10 rounded-full" />
          </div>
        </div>

        {/* Table header placeholder */}
        <div className="grid grid-cols-12 text-xs pb-4 border-b">
          <div className="col-span-1">
            <Skeleton className="w-6 h-4" />
          </div>
          <div className="col-span-5">
            <Skeleton className="w-20 h-4" />
          </div>
          <div className="col-span-4">
            <Skeleton className="w-20 h-4" />
          </div>
          <div className="col-span-2">
            <Skeleton className="w-16 h-4" />
          </div>
        </div>

        {/* Song list placeholders */}
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="grid grid-cols-12 py-4 items-center border-b border-gray-100">
              <div className="col-span-1">
                <Skeleton className="w-6 h-4" />
              </div>
              <div className="col-span-5">
                <Skeleton className="w-48 h-4" />
              </div>
              <div className="col-span-4">
                <Skeleton className="w-32 h-4" />
              </div>
              <div className="col-span-2">
                <Skeleton className="w-16 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
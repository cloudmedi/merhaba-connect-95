import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Music2 } from "lucide-react";

export function PlaylistDetailLoader() {
  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="p-6 space-y-8">
        {/* Back button skeleton */}
        <div className="flex items-center gap-2 text-gray-400">
          <ArrowLeft className="w-4 h-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Hero section */}
        <div className="flex items-start gap-8">
          {/* Artwork skeleton */}
          <div className="relative">
            <Skeleton className="w-48 h-48 rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
          </div>
          
          <div className="space-y-4 flex-1">
            {/* Title and metadata */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-20" />
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <Skeleton className="h-5 w-24" />
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
            
            {/* Tags */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </div>
        </div>

        {/* Songs list */}
        <div className="space-y-6">
          {/* Table header */}
          <div className="grid grid-cols-12 text-xs border-b pb-4">
            <div className="col-span-1">
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="col-span-5">
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="col-span-4">
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="col-span-2 text-right">
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          </div>

          {/* Song rows */}
          {[...Array(5)].map((_, index) => (
            <div 
              key={index} 
              className="grid grid-cols-12 py-4 items-center border-b border-gray-100 group"
            >
              <div className="col-span-1">
                <Skeleton className="h-8 w-8 rounded" />
              </div>
              <div className="col-span-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 relative">
                    <Skeleton className="w-full h-full rounded" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="col-span-4">
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="col-span-2 text-right">
                <Skeleton className="h-4 w-16 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
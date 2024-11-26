import React from 'react';

export function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p className="text-gray-600">Cihaz kaydediliyor...</p>
    </div>
  );
}
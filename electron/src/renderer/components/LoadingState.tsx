import React from 'react';

export function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-gray-600">Cihaz bilgileri yükleniyor...</p>
      </div>
    </div>
  );
}
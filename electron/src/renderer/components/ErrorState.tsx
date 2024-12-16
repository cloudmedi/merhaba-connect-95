import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-4 p-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
        <h2 className="text-red-700 font-semibold mb-2">Hata Oluştu</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Geri Dön
          </button>
          {onRetry && (
            <button 
              onClick={onRetry} 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Tekrar Dene
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
import React from 'react';

interface TokenDisplayProps {
  token: string | null;
}

export function TokenDisplay({ token }: TokenDisplayProps) {
  if (!token) return null;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Cihaz Token</h2>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="font-mono text-lg break-all text-center">{token}</p>
      </div>
    </div>
  );
}
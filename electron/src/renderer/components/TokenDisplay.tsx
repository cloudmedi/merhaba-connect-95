import React from 'react';

interface TokenDisplayProps {
  token: string | null;
}

export function TokenDisplay({ token }: TokenDisplayProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Cihaz Token</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        {token ? (
          <p className="text-2xl font-mono text-center">{token}</p>
        ) : (
          <p className="text-center text-gray-500">Token yükleniyor...</p>
        )}
      </div>
    </div>
  );
}
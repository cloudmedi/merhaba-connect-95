import React from 'react';

interface TokenDisplayProps {
  token: string | null;
}

export function TokenDisplay({ token }: TokenDisplayProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Device Token</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-2xl font-mono text-center">{token}</p>
      </div>
    </div>
  );
}
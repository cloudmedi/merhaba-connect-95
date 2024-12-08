import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key } from 'lucide-react';

interface TokenDisplayProps {
  token: string | null;
}

export function TokenDisplay({ token }: TokenDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Cihaz Token
          <div className="ml-auto px-2 py-1 text-xs bg-gray-100 rounded-full">
            Aktif
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 p-4 rounded-lg">
          {token ? (
            <p className="text-2xl font-mono text-center tracking-wider">
              {token}
            </p>
          ) : (
            <p className="text-center text-gray-500">Token yükleniyor...</p>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Bu token cihazınızı tanımlamak için kullanılır. Lütfen güvenli bir yerde saklayın.
        </p>
      </CardContent>
    </Card>
  );
}
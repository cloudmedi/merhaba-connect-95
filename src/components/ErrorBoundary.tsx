import React from 'react';
import { useRouteError } from 'react-router-dom';
import { ErrorState } from './ErrorState';

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  
  return (
    <ErrorState 
      error={error?.message || 'An unexpected error occurred'} 
      onRetry={() => window.location.reload()}
    />
  );
}
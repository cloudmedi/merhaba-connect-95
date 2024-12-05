import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Music Player error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="max-w-xl mx-auto my-4">
          <AlertTitle>Müzik oynatıcıda bir hata oluştu</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="text-sm mb-4">{this.state.error?.message}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={this.handleRetry}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Tekrar Dene
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
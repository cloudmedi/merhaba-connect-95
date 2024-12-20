import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export const useUploadProgress = () => {
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, UploadingFile>>({});

  const handleProgress = useCallback((fileName: string, progress: number) => {
    console.log('Progress update received:', { fileName, progress });
    setUploadingFiles(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        progress
      }
    }));
  }, []);

  const handleError = useCallback((fileName: string, error: string) => {
    console.error('Upload error:', { fileName, error });
    setUploadingFiles(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        status: 'error',
        error
      }
    }));
    toast.error(`${fileName}: ${error}`);
  }, []);

  const handleComplete = useCallback((fileName: string) => {
    console.log('Upload completed:', fileName);
    setUploadingFiles(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        status: 'completed',
        progress: 100
      }
    }));
    toast.success(`${fileName} başarıyla yüklendi`);
  }, []);

  const addFile = useCallback((file: File) => {
    setUploadingFiles(prev => ({
      ...prev,
      [file.name]: {
        file,
        progress: 0,
        status: 'uploading'
      }
    }));
  }, []);

  const removeFile = useCallback((fileName: string) => {
    setUploadingFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fileName];
      return newFiles;
    });
  }, []);

  return {
    uploadingFiles,
    handleProgress,
    handleError,
    handleComplete,
    addFile,
    removeFile
  };
};
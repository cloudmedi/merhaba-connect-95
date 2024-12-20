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
        progress,
        status: 'uploading' as const
      }
    }));
  }, []);

  const handleError = useCallback((fileName: string, error: string) => {
    console.error('Upload error:', { fileName, error });
    setUploadingFiles(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        status: 'error' as const,
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
        status: 'completed' as const,
        progress: 100
      }
    }));
    toast.success(`${fileName} başarıyla yüklendi`);
  }, []);

  const addFile = useCallback((file: File) => {
    console.log('Adding new file to upload queue:', file.name);
    setUploadingFiles(prev => ({
      ...prev,
      [file.name]: {
        file,
        progress: 0,
        status: 'uploading' as const
      }
    }));
  }, []);

  const removeFile = useCallback((fileName: string) => {
    console.log('Removing file from upload queue:', fileName);
    setUploadingFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fileName];
      console.log('Updated state after file removal:', newFiles);
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
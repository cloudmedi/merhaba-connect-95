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
    setUploadingFiles(prev => {
      const newState = {
        ...prev,
        [fileName]: {
          ...prev[fileName],
          progress
        }
      };
      console.log('New uploadingFiles state:', newState);
      return newState;
    });
  }, []);

  const handleError = useCallback((fileName: string, error: string) => {
    console.error('Upload error:', { fileName, error });
    setUploadingFiles(prev => {
      const newState = {
        ...prev,
        [fileName]: {
          ...prev[fileName],
          status: 'error',
          error
        }
      };
      console.log('Error state update:', newState);
      return newState;
    });
    toast.error(`${fileName}: ${error}`);
  }, []);

  const handleComplete = useCallback((fileName: string) => {
    console.log('Upload completed:', fileName);
    setUploadingFiles(prev => {
      const newState = {
        ...prev,
        [fileName]: {
          ...prev[fileName],
          status: 'completed',
          progress: 100
        }
      };
      console.log('Complete state update:', newState);
      return newState;
    });
    toast.success(`${fileName} başarıyla yüklendi`);
  }, []);

  const addFile = useCallback((file: File) => {
    console.log('Adding new file to upload queue:', file.name);
    setUploadingFiles(prev => {
      const newState = {
        ...prev,
        [file.name]: {
          file,
          progress: 0,
          status: 'uploading'
        }
      };
      console.log('New file added to state:', newState);
      return newState;
    });
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
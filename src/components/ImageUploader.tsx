
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Image } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  previewImage: string | null;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  previewImage, 
  className 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0];
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg']
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false)
  });

  return (
    <div 
      {...getRootProps()} 
      className={cn(
        'dropzone cursor-pointer rounded-md flex flex-col items-center justify-center p-4 transition-all duration-200 bg-white',
        isDragging ? 'dropzone-active' : '',
        className
      )}
    >
      <input {...getInputProps()} />
      {previewImage ? (
        <div className="relative w-full h-full">
          <img 
            src={previewImage} 
            alt="Preview" 
            className="w-full h-full object-contain rounded-md"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-md">
            <p className="text-white text-sm">Click or drop to replace</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <Image className="w-8 h-8 mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Drop an image here or click to upload</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

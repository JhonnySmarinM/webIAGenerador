'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StepProps } from '@/types';

// Simplified dropzone for this example
interface DropzoneProps {
  onDrop: (files: File[]) => void;
  maxSize?: number;
  accept?: string[];
  className?: string;
  children: React.ReactNode;
}

// Simple dropzone implementation instead of using @mantine/dropzone
function SimpleDropzone({ onDrop, accept, className, children }: DropzoneProps) {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      
      // Check file type if accept is provided
      if (accept && accept.length > 0) {
        const validFiles = files.filter(file => 
          accept.some(type => file.type.match(type.replace('*', '.*')))
        );
        if (validFiles.length > 0) {
          onDrop(validFiles);
        }
      } else {
        onDrop(files);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onDrop(files);
    }
  };
  
  return (
    <div 
      className={className}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        if (accept) {
          input.accept = accept.join(',');
        }
        input.onchange = (e) => handleFileSelect(e as unknown as React.ChangeEvent<HTMLInputElement>);
        input.click();
      }}
    >
      {children}
    </div>
  );
}

export default function UploadLogo({ data, updateData, onNext, onBack }: StepProps) {
  const [logoFile, setLogoFile] = useState<File | null>(data?.logo || null);
  const [logoPreview, setLogoPreview] = useState<string>(data?.logoPreview || '');
  const [error, setError] = useState('');

  const handleDrop = (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Validation
    if (!file.type.includes('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File is too large. Please upload an image smaller than 5MB');
      return;
    }
    
    setLogoFile(file);
    setError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const preview = e.target.result.toString();
        setLogoPreview(preview);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
  };

  const handleNext = () => {
    updateData?.({ 
      logo: logoFile,
      logoPreview 
    });
    onNext();
  };

  const handleSkip = () => {
    updateData?.({ 
      logo: null,
      logoPreview: '' 
    });
    onNext();
  };

  return (
    <Card
      title="Upload Your Logo (Optional)"
      description="Add your logo to personalize your website."
      footer={
        <div className="flex justify-between">
          <div>
            <Button variant="outline" onClick={onBack} className="mr-2">
              Back
            </Button>
            <Button variant="outline" onClick={handleSkip}>
              Skip This Step
            </Button>
          </div>
          <Button onClick={handleNext}>
            Next Step
          </Button>
        </div>
      }
    >
      {!logoPreview ? (
        <SimpleDropzone
          onDrop={handleDrop}
          maxSize={5 * 1024 * 1024}
          accept={['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 text-center cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-16 h-16 mb-4"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" 
              />
            </svg>
            <p className="text-lg font-medium">Drag & drop your logo here</p>
            <p className="mt-1">or click to browse files</p>
            <p className="text-sm mt-2">Supported formats: PNG, JPG, SVG, WebP (max 5MB)</p>
          </div>
        </SimpleDropzone>
      ) : (
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-4 max-w-xs">
            <img 
              src={logoPreview} 
              alt="Logo Preview" 
              className="max-h-40 mx-auto" 
            />
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={handleRemoveLogo} size="sm">
              Remove Logo
            </Button>
            <Button 
              size="sm" 
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/png,image/jpeg,image/svg+xml,image/webp';
                input.onchange = (e) => {
                  if (e.target && (e.target as HTMLInputElement).files && (e.target as HTMLInputElement).files!.length > 0) {
                    handleDrop(Array.from((e.target as HTMLInputElement).files!));
                  }
                };
                input.click();
              }}
            >
              Replace Logo
            </Button>
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-red-500 mt-3 text-sm">{error}</p>
      )}
      
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p className="font-medium">Tips:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Use a transparent background for best results</li>
          <li>Simpler logos tend to work better across different screen sizes</li>
          <li>Your logo will be automatically resized to fit different placements</li>
        </ul>
      </div>
    </Card>
  );
}

'use client';

import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StepProps } from '@/types';

const predefinedColors = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Orange', value: '#F97316' },
];

export default function SelectColor({ data, updateData, onNext, onBack }: StepProps) {
  const [selectedColor, setSelectedColor] = useState(data?.mainColor || '#3B82F6');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = (color: { hex: string }) => {
    setSelectedColor(color.hex);
  };

  const handleNext = () => {
    updateData?.({ mainColor: selectedColor });
    onNext();
  };

  return (
    <Card
      title="Select a Primary Color"
      description="Choose a color that will be used throughout your website."
      footer={
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleNext}>
            Next Step
          </Button>
        </div>
      }
    >
      <div className="flex flex-wrap gap-3 mb-6">
        {predefinedColors.map((color) => (
          <div
            key={color.value}
            className={`w-12 h-12 rounded-full cursor-pointer transition-all transform hover:scale-110 flex items-center justify-center ${
              selectedColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => setSelectedColor(color.value)}
            title={color.name}
          >
            {selectedColor === color.value && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        ))}
        
        <div
          className={`w-12 h-12 rounded-full cursor-pointer border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-700 ${
            !predefinedColors.some(c => c.value === selectedColor) ? 'ring-2 ring-offset-2 ring-blue-500' : ''
          }`}
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          {!predefinedColors.some(c => c.value === selectedColor) ? (
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: selectedColor }}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          )}
        </div>
      </div>

      {showColorPicker && (
        <div className="mb-6 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
          <ChromePicker
            color={selectedColor}
            onChange={handleColorChange}
            disableAlpha
            className="w-full max-w-md mx-auto"
          />
        </div>
      )}

      <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-3">Preview</h3>
        <div className="flex flex-col gap-4">
          <div 
            className="h-20 rounded-lg" 
            style={{ backgroundColor: selectedColor }}
          />
          <div className="flex gap-4">
            <div 
              className="h-12 w-full rounded-lg" 
              style={{ backgroundColor: selectedColor }}
            />
            <div 
              className="h-12 w-full rounded-lg opacity-75" 
              style={{ backgroundColor: selectedColor }}
            />
            <div 
              className="h-12 w-full rounded-lg opacity-50" 
              style={{ backgroundColor: selectedColor }}
            />
          </div>
          <div>
            <button
              className="px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: selectedColor }}
            >
              Sample Button
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

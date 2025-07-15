'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StepProps } from '@/types';

const fontOptions = [
  { name: 'Inter', value: 'Inter', sample: 'Modern and clean' },
  { name: 'Roboto', value: 'Roboto', sample: 'Professional and versatile' },
  { name: 'Poppins', value: 'Poppins', sample: 'Friendly and approachable' },
  { name: 'Playfair Display', value: 'Playfair Display', sample: 'Elegant and sophisticated' },
  { name: 'Montserrat', value: 'Montserrat', sample: 'Contemporary and balanced' },
  { name: 'Open Sans', value: 'Open Sans', sample: 'Highly readable and neutral' },
  { name: 'Lato', value: 'Lato', sample: 'Warm and approachable' },
  { name: 'Raleway', value: 'Raleway', sample: 'Stylish and modern' },
];

export default function SelectFont({ data, updateData, onNext, onBack }: StepProps) {
  const selectedFont = data.typography;

  const handleFontSelect = (font: string) => {
    updateData({ typography: font });
  };

  return (
    <Card
      title="Select Typography"
      description="Choose a font that matches the style of your website."
      footer={
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>
            Next Step
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fontOptions.map((font) => (
          <div
            key={font.value}
            className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
              selectedFont === font.value 
                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => handleFontSelect(font.value)}
          >
            <p className="text-xl font-medium mb-2" style={{ fontFamily: font.value }}>
              {font.name}
            </p>
            <p className="text-gray-600 dark:text-gray-300" style={{ fontFamily: font.value }}>
              {font.sample}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm" style={{ fontFamily: font.value }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm" style={{ fontFamily: font.value }}>
              abcdefghijklmnopqrstuvwxyz
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

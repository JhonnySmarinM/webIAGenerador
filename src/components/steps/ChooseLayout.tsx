'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StepProps } from '@/types';

const layoutOptions = [
  {
    id: 'layout1',
    name: 'Modern',
    description: 'Clean, minimal design with focus on content',
    image: '/layouts/modern.svg'
  },
  {
    id: 'layout2',
    name: 'Classic',
    description: 'Traditional layout with sidebar and header',
    image: '/layouts/classic.svg'
  },
  {
    id: 'layout3',
    name: 'Creative',
    description: 'Unique layout with dynamic elements',
    image: '/layouts/creative.svg'
  }
];

export default function ChooseLayout({ data, updateData, onNext, onBack }: StepProps) {
  const selectedLayout = data.layout;

  const handleLayoutSelect = (layoutId: 'layout1' | 'layout2' | 'layout3') => {
    updateData({ layout: layoutId });
  };

  return (
    <Card
      title="Choose a Layout"
      description="Select a base layout for your website."
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {layoutOptions.map((layout) => (
          <div
            key={layout.id}
            className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
              selectedLayout === layout.id 
                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800 shadow-md' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => handleLayoutSelect(layout.id as 'layout1' | 'layout2' | 'layout3')}
          >
            <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4">
              {/* Placeholder for layout preview images */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="w-full">
                  {layout.id === 'layout1' && (
                    <div className="flex flex-col space-y-2">
                      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                      <div className="flex space-x-1">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                      </div>
                      <div className="h-24 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                    </div>
                  )}
                  
                  {layout.id === 'layout2' && (
                    <div className="flex space-x-2">
                      <div className="w-1/4 space-y-2">
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                      <div className="w-3/4 space-y-2">
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="h-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                    </div>
                  )}
                  
                  {layout.id === 'layout3' && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                      <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg">{layout.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{layout.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <h3 className="font-medium mb-2">Layout Preview</h3>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded">
            {selectedLayout && (
              <div className="text-gray-500 dark:text-gray-400">
                <p className="text-xl font-medium mb-2">{layoutOptions.find(l => l.id === selectedLayout)?.name}</p>
                <p>{layoutOptions.find(l => l.id === selectedLayout)?.description}</p>
                <p className="mt-4 text-sm">A more detailed preview will be shown in the results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

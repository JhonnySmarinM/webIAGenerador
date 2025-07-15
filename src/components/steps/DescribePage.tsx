'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StepProps } from '@/types';

export default function DescribePage({ data, updateData, onNext }: StepProps) {
  const [description, setDescription] = useState(data.description);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (description.trim().length < 10) {
      setError('Please provide a more detailed description (at least 10 characters)');
      return;
    }
    
    updateData({ description });
    onNext();
  };

  return (
    <Card 
      title="Describe Your Website"
      description="Tell us what kind of website you want to create. Be as specific as possible."
      footer={
        <div className="flex justify-end">
          <Button onClick={handleSubmit} type="submit">
            Next Step
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 
                    dark:text-white min-h-[150px] resize-none"
          placeholder="Examples: A portfolio website for a photographer, A blog for sharing recipes, An e-commerce site for handmade jewelry, etc."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (e.target.value.trim().length >= 10) {
              setError('');
            }
          }}
        />
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Include details about the purpose, target audience, and key features you'd like to have.
          </p>
        </div>
      </form>
    </Card>
  );
}

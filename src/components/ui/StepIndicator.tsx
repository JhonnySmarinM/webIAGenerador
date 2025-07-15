'use client';

import React from 'react';
import { useTemplate } from '@/context/TemplateContext';

const stepLabels = {
  'description': 'Describe',
  'color': 'Color',
  'typography': 'Typography',
  'logo': 'Logo',
  'layout': 'Layout',
  'results': 'Results'
};

export default function StepIndicator() {
  const { currentStep, steps, goToStep } = useTemplate();

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <React.Fragment key={step}>
              <button
                onClick={() => index <= currentStep && goToStep(index)}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                }`}
                disabled={index > currentStep}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                  {stepLabels[step]}
                </span>
              </button>
              
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

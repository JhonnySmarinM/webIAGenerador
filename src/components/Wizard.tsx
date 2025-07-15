'use client';

import React from 'react';
import { useTemplate } from '@/context/TemplateContext';
import StepIndicator from '@/components/ui/StepIndicator';
import DescribePage from '@/components/steps/DescribePage';
import SelectColor from '@/components/steps/SelectColor';
import SelectFont from '@/components/steps/SelectFont';
import UploadLogo from '@/components/steps/UploadLogo';
import ChooseLayout from '@/components/steps/ChooseLayout';
import ResultsStep from '@/components/steps/ResultsStep';
import { AnimatePresence, motion } from 'framer-motion';

export default function Wizard() {
  const { 
    templateData, 
    updateTemplateData, 
    currentStep, 
    goToNextStep, 
    goToPreviousStep,
    steps 
  } = useTemplate();

  // Map steps to components
  const stepComponents = {
    'description': DescribePage,
    'color': SelectColor,
    'typography': SelectFont,
    'logo': UploadLogo,
    'layout': ChooseLayout,
    'results': ResultsStep
  };

  // Get current component
  const CurrentStepComponent = stepComponents[steps[currentStep]];

  // Common props for all step components
  const stepProps = {
    data: templateData,
    updateData: updateTemplateData,
    onNext: goToNextStep,
    onBack: goToPreviousStep,
    isLastStep: currentStep === steps.length - 1,
  };

  return (
    <div className="py-8 px-4 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl mb-8">
        <StepIndicator />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent {...stepProps} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

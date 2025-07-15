'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TemplateData, StepId, TemplateSelections, GenerationOutput } from '@/types';

interface TemplateContextType {
  templateData: TemplateData;
  updateTemplateData: (update: Partial<TemplateData>) => void;
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (stepIndex: number) => void;
  steps: StepId[];
  resetTemplate: () => void;
  generatedPrompts: string[];
  setGeneratedPrompts: (prompts: string[]) => void;
  selections: TemplateSelections;
  updateSelection: <K extends keyof TemplateSelections>(key: K, value: TemplateSelections[K]) => void;
  generatedOutput: GenerationOutput | null;
  setGeneratedOutput: (output: GenerationOutput | null) => void;
  resetSelections: () => void;
}

const defaultTemplateData: TemplateData = {
  description: '',
  primaryColor: '#3B82F6', // Default to a nice blue
  typography: 'Inter',
  logo: null,
  logoPreview: '',
  layout: 'layout1',
};

const defaultSelections: TemplateSelections = {
  description: '',
  mainColor: '#007bff', // Default color
  typography: 'Arial', // Default typography
  logo: null,
  logoPreview: null,
  baseDesign: '',
};

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [templateData, setTemplateData] = useState<TemplateData>(defaultTemplateData);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [selections, setSelections] = useState<TemplateSelections>(defaultSelections);
  const [generatedOutput, setGeneratedOutput] = useState<GenerationOutput | null>(null);

  const steps: StepId[] = ['description', 'color', 'typography', 'logo', 'layout', 'results'];

  const updateTemplateData = (update: Partial<TemplateData>) => {
    setTemplateData((prev) => ({ ...prev, ...update }));
  };

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const resetTemplate = () => {
    setTemplateData(defaultTemplateData);
    setCurrentStep(0);
    setGeneratedPrompts([]);
  };

  const updateSelection = <K extends keyof TemplateSelections>(key: K, value: TemplateSelections[K]) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

  const resetSelections = () => {
    setSelections(defaultSelections);
    setGeneratedOutput(null);
  };

  return (
    <TemplateContext.Provider
      value={{
        templateData,
        updateTemplateData,
        currentStep,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        steps,
        resetTemplate,
        generatedPrompts,
        setGeneratedPrompts,
        selections,
        updateSelection,
        generatedOutput,
        setGeneratedOutput,
        resetSelections,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
}

export const useTemplateContext = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplateContext must be used within a TemplateProvider');
  }
  return context;
};

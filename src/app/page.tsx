'use client';

import React, { useState } from 'react';
import { useTemplateContext } from '@/context/TemplateContext';
import DescribePageStep from '@/components/steps/DescribePageStep';
import SelectColorStep from '@/components/steps/SelectColorStep';
import SelectTypographyStep from '@/components/steps/SelectTypographyStep';
import UploadLogoStep from '@/components/steps/UploadLogoStep'; 
import SelectBaseDesignStep from '@/components/steps/SelectBaseDesignStep';
import ResultsDisplayPage from '@/components/ResultsDisplayPage'; 
import { TemplateSelections, GenerationOutput } from '@/types';

const TOTAL_STEPS = 5; // Descripción, Color, Tipografía, Logo, Diseño Base

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selections, setGeneratedOutput, generatedOutput, resetSelections } = useTemplateContext();

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    if (!selections.description || !selections.mainColor || !selections.typography || !selections.baseDesign) {
      alert("Por favor, completa todos los campos requeridos antes de generar la plantilla.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedOutput(null); // Limpiar resultados anteriores

    try {
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selections),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error del servidor: ${response.status}`);
      }

      const data: GenerationOutput = await response.json();
      setGeneratedOutput(data);
    } catch (err: any) {
      console.error("Error al generar plantilla:", err);
      setError(err.message || 'Ocurrió un error al generar la plantilla.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    resetSelections();
    setCurrentStep(1);
    setError(null);
  };

  if (generatedOutput) {
    return <ResultsDisplayPage onStartOver={handleStartOver} />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <DescribePageStep onNext={handleNext} />;
      case 2:
        return <SelectColorStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <SelectTypographyStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 4:
        return <UploadLogoStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 5:
        return (
          <SelectBaseDesignStep 
            onPrevious={handlePrevious} 
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        );
      default:
        return <p>Paso desconocido.</p>;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl min-h-screen flex flex-col justify-center">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-700">
          Constructor de Plantillas Web Interactivo
        </h1>
        
        <div className="mb-8">
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
            </div>
            <p className="text-xs text-center text-gray-600">Paso {currentStep} de {TOTAL_STEPS}</p>
          </div>
        </div>

        {renderStep()}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
      </div>
       <footer className="text-center mt-8 text-sm text-gray-500">
        <p>Powered by Next.js & (Simulated) Gemini Gema</p>
      </footer>
    </div>
  );
}

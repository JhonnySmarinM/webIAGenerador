import React from 'react';
import { useTemplateContext } from '@/context/TemplateContext';
import { StepProps } from '@/types';

const DescribePageStep: React.FC<StepProps> = ({ onNext }) => {
  const { selections, updateSelection } = useTemplateContext();

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">1. Describe tu página web</h2>
      <p className="mb-2 text-description">Proporciona una breve descripción de la página web que quieres crear. Esto ayudará a la IA a entender el propósito y contenido.</p>
      <textarea
        className="w-full p-2 border rounded bg-[var(--card-background)] text-[var(--card-foreground)] border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
        rows={4}
        value={selections.description}
        onChange={(e) => updateSelection('description', e.target.value)}
        placeholder="Ej: Una landing page para una app de fitness, un portfolio para un fotógrafo, una tienda online de productos artesanales..."
      />
      <button onClick={onNext} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Siguiente
      </button>
    </div>
  );
};

export default DescribePageStep; 
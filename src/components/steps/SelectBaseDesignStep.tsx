import React from 'react';
import { useTemplateContext } from '@/context/TemplateContext';
// import { StepProps } from '@/types'; // StepProps no se usa directamente si tenemos props más específicas

interface SelectBaseDesignStepProps {
  onPrevious?: () => void;
  onGenerate: () => void; 
  isLoading: boolean; 
}

const baseDesigns = [
  { id: 'design1', name: 'Diseño Moderno y Limpio', description: 'Ideal para startups y portfolios.' },
  { id: 'design2', name: 'Diseño Clásico y Elegante', description: 'Perfecto para negocios establecidos.' },
  { id: 'design3', name: 'Diseño Atrevido y Creativo', description: 'Para marcas que quieren destacar.' },
];

const SelectBaseDesignStep: React.FC<SelectBaseDesignStepProps> = ({ onPrevious, onGenerate, isLoading }) => {
  const { selections, updateSelection } = useTemplateContext();

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">5. Elige un diseño base</h2>
      <p className="mb-3 text-description">Selecciona una estructura base. La IA adaptará los detalles según tus elecciones previas.</p>
      
      <div className="space-y-3 mb-4">
        {baseDesigns.map(design => (
          <div 
            key={design.id} 
            onClick={() => updateSelection('baseDesign', design.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer hover:shadow-lg transition-all duration-150 ease-in-out 
                        ${selections.baseDesign === design.id 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500 ring-offset-2 ring-offset-[var(--card-background)]' 
                          : 'border-gray-300 dark:border-gray-600 bg-[var(--card-background)] hover:border-gray-400 dark:hover:border-gray-500'}
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[var(--card-background)]`}
          >
            <h3 className="font-semibold text-md">{design.name}</h3>
            <p className="text-xs text-muted">{design.description}</p>
          </div>
        ))}
      </div>

      {!selections.baseDesign && (
        <p className="text-xs text-red-500 mb-3">Por favor, selecciona un diseño base para continuar.</p>
      )}

      <div className="flex justify-between mt-6">
        {onPrevious && (
            <button 
            onClick={onPrevious} 
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            disabled={isLoading}
            >
            Anterior
            </button>
        )}
        <button 
          onClick={onGenerate} 
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 ml-auto"
          disabled={!selections.baseDesign || isLoading}
        >
          {isLoading ? 'Generando...' : 'Generar Plantilla'}
        </button>
      </div>
    </div>
  );
};

export default SelectBaseDesignStep; 
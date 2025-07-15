import React from 'react';
import { useTemplateContext } from '@/context/TemplateContext';
import { StepProps } from '@/types';

const colors = [
  { name: 'Azul Predeterminado', value: '#007bff' },
  { name: 'Verde Esmeralda', value: '#28a745' },
  { name: 'Rojo Carmesí', value: '#dc3545' },
  { name: 'Amarillo Sol', value: '#ffc107' },
  { name: 'Turquesa Marino', value: '#17a2b8' },
  { name: 'Gris Pizarra', value: '#6c757d' },
];

const SelectColorStep: React.FC<StepProps> = ({ onNext, onPrevious }) => {
  const { selections, updateSelection } = useTemplateContext();

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">2. Selecciona un color principal</h2>
      <p className="mb-3 text-description">Este color se usará como base para los elementos principales de tu web (botones, enlaces, acentos).</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {colors.map(color => (
          <button
            key={color.value}
            onClick={() => updateSelection('mainColor', color.value)}
            className={`p-3 rounded border-2 transition-all duration-150 ease-in-out 
                        ${selections.mainColor === color.value 
                          ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-[var(--card-background)]' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[var(--card-background)]`}
            title={color.name}
          >
            <div style={{ backgroundColor: color.value }} className="w-full h-10 rounded shadow-inner" />
            <span className="text-xs mt-2 block text-center text-muted">{color.name}</span>
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={onPrevious} className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">
          Anterior
        </button>
        <button onClick={onNext} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default SelectColorStep; 
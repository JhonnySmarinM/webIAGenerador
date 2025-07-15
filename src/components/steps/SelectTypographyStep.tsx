import React from 'react';
import { useTemplateContext } from '@/context/TemplateContext';
import { StepProps } from '@/types';

const typographyOptions = [
  'Arial, Helvetica, sans-serif',
  'Verdana, Geneva, sans-serif',
  'Tahoma, Geneva, sans-serif',
  '\'Trebuchet MS\', Helvetica, sans-serif',
  '\'Times New Roman\', Times, serif',
  'Georgia, serif',
  'Garamond, serif',
  '\'Courier New\', Courier, monospace',
  '\'Brush Script MT\', cursive',
  'Roboto, sans-serif', // Google Font example
  'Open Sans, sans-serif', // Google Font example
  'Lato, sans-serif', // Google Font example
  'Montserrat, sans-serif', // Google Font example
  'Poppins, sans-serif', // Google Font example
];

const SelectTypographyStep: React.FC<StepProps> = ({ onNext, onPrevious }) => {
  const { selections, updateSelection } = useTemplateContext();

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">3. Selecciona una tipografía</h2>
      <p className="mb-3 text-description">
        Elige la familia tipográfica principal para los textos de tu página web. Algunas opciones populares de Google Fonts están incluidas.
      </p>
      <select
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[var(--card-background)] text-[var(--card-foreground)]"
        value={selections.typography}
        onChange={(e) => updateSelection('typography', e.target.value)}
      >
        {typographyOptions.map(font => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font.split(',')[0].replace(/\'/g, '')} {/* Show only the primary font name */}
          </option>
        ))}
      </select>
      <div className="flex justify-between mt-6">
        {onPrevious && (
            <button onClick={onPrevious} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors">
            Anterior
            </button>
        )}
        <button 
            onClick={onNext} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ml-auto"
            disabled={!selections.typography} // Disable if no typography is selected
        >
          Siguiente
        </button>
      </div>
       {selections.typography && selections.typography.toLowerCase().includes(' ') && (
        <p className="text-xs text-muted mt-3">
          Nota: Para fuentes de Google Fonts como &quot;{selections.typography.split(',')[0].replace(/'/g, '')}&quot;, asegúrate de que la plantilla generada incluya la importación correcta desde Google Fonts en el HTML.
        </p>
      )}
    </div>
  );
};

export default SelectTypographyStep; 
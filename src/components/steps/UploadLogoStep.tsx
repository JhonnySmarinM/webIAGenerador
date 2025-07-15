import React, { useState, ChangeEvent } from 'react';
import { useTemplateContext } from '@/context/TemplateContext';
import { StepProps } from '@/types';

const UploadLogoStep: React.FC<StepProps> = ({ onNext, onPrevious }) => {
  const { selections, updateSelection } = useTemplateContext();
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Límite de 2MB
        setFileError('El archivo es demasiado grande. Máximo 2MB.');
        updateSelection('logo', null);
        updateSelection('logoPreview', null);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(file.type)) {
        setFileError('Tipo de archivo no admitido. Sube JPG, PNG, GIF o SVG.');
        updateSelection('logo', null);
        updateSelection('logoPreview', null);
        return;
      }
      
      setFileError(null);
      updateSelection('logo', file);

      const reader = new FileReader();
      reader.onloadend = () => {
        updateSelection('logoPreview', reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      updateSelection('logo', null);
      updateSelection('logoPreview', null);
    }
  };

  const handleRemoveLogo = () => {
    updateSelection('logo', null);
    updateSelection('logoPreview', null);
    const inputFile = document.getElementById('logo-upload') as HTMLInputElement;
    if (inputFile) {
        inputFile.value = "";
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">4. Carga tu logo (opcional)</h2>
      <p className="mb-3 text-description">Sube el logo de tu marca o proyecto. Se mostrará en la cabecera de la plantilla.</p>
      
      <input
        type="file"
        id="logo-upload"
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-3 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        accept="image/png, image/jpeg, image/gif, image/svg+xml"
        onChange={handleFileChange}
      />

      {fileError && <p className="text-xs text-red-500 mb-2">{fileError}</p>}

      {selections.logoPreview && (
        <div className="mt-3 p-3 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 inline-block">
          <h4 className="text-sm font-medium mb-2 text-description">Vista previa del logo:</h4>
          <img src={selections.logoPreview} alt="Vista previa del Logo" className="max-h-20 max-w-xs mx-auto rounded" />
          <button 
            onClick={handleRemoveLogo} 
            className="mt-2 text-xs text-red-600 hover:text-red-800"
          >
            Quitar logo
          </button>
        </div>
      )}
      
      {!selections.logoPreview && (
          <p className="text-xs text-muted mt-1">No se ha cargado ningún logo.</p>
      )}

      <div className="flex justify-between mt-6">
        {onPrevious && (
            <button onClick={onPrevious} className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">
                Anterior
            </button>
        )}
        <button onClick={onNext} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto">
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default UploadLogoStep; 
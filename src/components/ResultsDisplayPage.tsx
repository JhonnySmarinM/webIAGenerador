'use client';

import React from 'react';
import { useTemplateContext } from '@/context/TemplateContext';
import GeneratedPromptsDisplay from './results/GeneratedPromptsDisplay';
import GeneratedCodePreview from './results/GeneratedCodePreview';
import DownloadCodeButton from './results/DownloadCodeButton';

interface ResultsDisplayPageProps {
  onStartOver: () => void;
}

const ResultsDisplayPage: React.FC<ResultsDisplayPageProps> = ({ onStartOver }) => {
  const { generatedOutput, selections } = useTemplateContext();

  const handleOpenInNewTab = () => {
    if (generatedOutput?.template) {
      const { html, css, js } = generatedOutput.template;
      const siteTitle = selections.description || "Plantilla Generada";
      
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${siteTitle}</title>
          <style>
            body { margin: 0; } /* Reset básico */
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            //<![CDATA[
            ${js}
            //]]>
          </script>
        </body>
        </html>
      `;

      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const newTab = window.open(url, '_blank');
      if (newTab) {
        newTab.focus();
      } else {
        alert("Por favor, permite las ventanas emergentes para ver la plantilla.");
      }
      // Opcional: revocar la URL después de un tiempo para liberar memoria, aunque para una nueva pestaña puede no ser crítico inmediatamente.
      // setTimeout(() => URL.revokeObjectURL(url), 60000); 
    }
  };

  if (!generatedOutput) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-xl text-gray-700 dark:text-gray-300">Aún no se han generado resultados o se está volviendo al inicio.</p>
        <button 
          onClick={onStartOver} 
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Comenzar de Nuevo
        </button>
      </div>
    );
  }

  const { prompts, template } = generatedOutput;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-10">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-200">¡Tu Plantilla está Lista!</h1>
          <button 
            onClick={onStartOver} 
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Crear Nueva Plantilla
          </button>
        </div>

        <div className="mb-8 p-4 border rounded-md bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-3 text-gray-600 dark:text-gray-300">Prompts Sugeridos para IA</h2>
          <GeneratedPromptsDisplay prompts={prompts} />
        </div>

        {template && (
          <div className="mb-8 p-4 border rounded-md border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-3 text-gray-600 dark:text-gray-300">Previsualización de Plantilla</h2>
            <GeneratedCodePreview code={template} title={selections.description || "Plantilla Web"} />
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
              <DownloadCodeButton code={template} filenamePrefix={selections.description.replace(/[^a-z0-9]/gi, '_').toLowerCase() || "mi_plantilla"} />
              <button 
                onClick={handleOpenInNewTab}
                className="px-8 py-3 bg-sky-500 text-white rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300 shadow-md transition-transform transform hover:scale-105"
              >
                Abrir en Nueva Pestaña
              </button>
            </div>
            <p className="text-xs text-muted mt-3 text-center">
              Nota: La previsualización es una representación básica. La descarga incluye HTML, CSS y JS.
            </p>
          </div>
        )}
        {!template && prompts && prompts.length > 0 && !prompts.some(p => p.id.startsWith('error')) && (
            <p className="text-center text-yellow-700 dark:text-yellow-300 my-6 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-3 rounded-md text-sm">
              El modelo de IA generó prompts, pero no una plantilla de código directamente esta vez. Puedes usar los prompts de arriba con otra IA o intentarlo de nuevo.
            </p>
        )}
         {(!template && prompts && prompts.some(p => p.id.startsWith('error'))) && (
            <p className="text-center text-red-700 dark:text-red-300 my-6 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 p-3 rounded-md text-sm">
              Hubo un error al generar la plantilla o los prompts con la IA. Revisa los logs del servidor.
            </p>
        )}

      </div>
      <footer className="text-center mt-8 text-sm text-muted">
        <p>Powered by Next.js & Google Gemini AI</p>
      </footer>
    </div>
  );
};

export default ResultsDisplayPage; 
import React, { useEffect, useRef } from 'react';
import { GeneratedCode } from '@/types';

interface GeneratedCodePreviewProps {
  code: GeneratedCode;
  title?: string;
}

const GeneratedCodePreview: React.FC<GeneratedCodePreviewProps> = ({ code, title = "Vista Previa" }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && code) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const fullHtml = `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
              body { margin: 0; font-family: sans-serif; } /* Basic reset for preview */
              ${code.css}
            </style>
          </head>
          <body>
            ${code.html}
            <script>
              // It's generally safer to avoid direct script injection if possible,
              // or ensure the script source is trusted and sanitized.
              // For this simulation, we proceed with direct injection.
              ${code.js}
            </script>
          </body>
          </html>
        `;
        doc.open();
        doc.write(fullHtml);
        doc.close();
      }
    }
  }, [code, title]);

  if (!code || !code.html) { // Check if code and code.html exist
    return <p className="text-center text-gray-500 p-4">No hay código HTML para previsualizar.</p>;
  }

  return (
    <div className="border rounded-md overflow-hidden w-full bg-white shadow">
      <iframe
        ref={iframeRef}
        title="Previsualización de la Plantilla Web"
        className="w-full h-96 md:h-[600px] border-0" // border-0 para quitar borde del iframe
        sandbox="allow-scripts allow-same-origin" 
      />
    </div>
  );
};

export default GeneratedCodePreview; 
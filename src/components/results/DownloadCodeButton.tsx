import React from 'react';
import { GeneratedCode } from '@/types';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface DownloadCodeButtonProps {
  code: GeneratedCode;
  filenamePrefix?: string;
}

const DownloadCodeButton: React.FC<DownloadCodeButtonProps> = ({ code, filenamePrefix = "plantilla_web" }) => {
  const handleDownload = async () => {
    if (!code) {
      alert("No hay código para descargar.");
      return;
    }

    const zip = new JSZip();
    zip.file("index.html", code.html);
    zip.file("styles.css", code.css);
    zip.file("script.js", code.js);

    const readmeContent = `
# Plantilla Web Generada

Esta plantilla fue generada interactivamente.

Archivos:
- index.html: Estructura principal de la página.
- styles.css: Estilos CSS.
- script.js: Lógica JavaScript.

Para ver la plantilla, abre 'index.html' en tu navegador.
    `;
    zip.file("README.md", readmeContent);

    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${filenamePrefix}.zip`);
    } catch (error) {
      console.error("Error al generar el ZIP:", error);
      alert("Hubo un error al intentar generar el archivo ZIP.");
    }
  };

  return (
    <button 
      onClick={handleDownload}
      className="px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-md transition-transform transform hover:scale-105"
    >
      Descargar Código Fuente (.zip)
    </button>
  );
};

export default DownloadCodeButton; 
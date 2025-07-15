import React from 'react';
import { GeneratedPrompt } from '@/types';

interface GeneratedPromptsDisplayProps {
  prompts: GeneratedPrompt[];
}

const GeneratedPromptsDisplay: React.FC<GeneratedPromptsDisplayProps> = ({ prompts }) => {
  if (!prompts || prompts.length === 0) {
    return <p className="text-sm text-gray-500">No se generaron prompts.</p>;
  }

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('¡Prompt copiado al portapapeles!')) // Consider using a less intrusive notification
      .catch(err => console.error('Error al copiar prompt: ', err));
  };

  return (
    <ul className="space-y-3">
      {prompts.map((prompt) => (
        <li key={prompt.id} className="p-3 bg-white border border-gray-200 rounded shadow-sm">
          <p className="text-sm text-gray-700 mb-2 break-words">{prompt.text}</p>
          <button 
            onClick={() => handleCopyPrompt(prompt.text)}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Copiar Prompt
          </button>
        </li>
      ))}
    </ul>
  );
};

export default GeneratedPromptsDisplay; 
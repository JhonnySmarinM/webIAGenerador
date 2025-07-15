// Type definitions for the template builder application

export interface TemplateSelections {
  description: string;
  mainColor: string;
  typography: string;
  logo?: File | null;
  logoPreview?: string | null; // Para almacenar Data URL de la vista previa del logo
  baseDesign: string; // ID del diseño base elegido, ej: 'design1', 'design2'
}

export interface GeneratedPrompt {
  id: string; // Identificador único para el prompt
  text: string; // El contenido del prompt
}

export interface GeneratedCode {
  html: string;
  css: string;
  js: string;
}

export interface GenerationOutput {
  prompts: GeneratedPrompt[];
  template?: GeneratedCode; // La plantilla de código puede ser opcional
}

export interface StepProps {
  data?: TemplateSelections;
  updateData?: (data: Partial<TemplateSelections>) => void;
  onNext: () => void;
  onPrevious?: () => void; // Opcional, ya que el primer paso no tiene "anterior"
  onBack?: () => void; // Alias para onPrevious
}

export type StepId = 'description' | 'color' | 'typography' | 'logo' | 'layout' | 'results';

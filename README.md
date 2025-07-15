# Web IA Generador

Una aplicación Next.js que permite a los usuarios construir plantillas web a través de una interfaz guiada paso a paso. Los usuarios pueden describir su sitio web, seleccionar colores, fuentes, subir un logo y elegir un diseño. La aplicación luego genera prompts de IA que pueden ser utilizados para crear el código real del sitio web.

## Features

- Multi-step interface with intuitive navigation
- Interactive color selector
- Typography previews
- Logo upload capability
- Layout selection with visual previews
- AI prompt generation based on user selections
- Template code preview and download functionality

## Tech Stack

- Next.js 15+
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- React Color for color selection
- Mantine Dropzone for file uploads
- JSZip for generating downloadable code archives
- React Syntax Highlighter for code displaying

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/JhonnySmarinM/webIAGenerador.git
cd web-ia-generador
```

2. Install dependencies:
```
npm install
# or
yarn install
```

3. Run the development server:
```
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page component
├── components/
│   ├── steps/            # Step components for the wizard
│   │   ├── DescribePage.tsx
│   │   ├── SelectColor.tsx
│   │   ├── SelectFont.tsx
│   │   ├── UploadLogo.tsx
│   │   ├── ChooseLayout.tsx
│   │   └── ResultsStep.tsx
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── StepIndicator.tsx
│   └── Wizard.tsx        # Main wizard component
├── context/
│   └── TemplateContext.tsx  # Context for managing wizard state
├── types/
│   └── index.ts          # TypeScript type definitions
└── utils/
    └── promptGenerator.ts # Utility for generating AI prompts
```

## Deployment

This project is configured for easy deployment to Vercel. Just connect your GitHub repository to Vercel and deploy.

## Extending the Project

### Adding New Steps

1. Create a new component in the `src/components/steps` directory
2. Add the new step ID to the `StepId` type in `src/types/index.ts`
3. Add the step to the `steps` array in `TemplateContext.tsx`
4. Add the component to the `stepComponents` mapping in `Wizard.tsx`

### Customizing Prompts

Modify the `promptGenerator.ts` file to change how prompts are generated based on user selections.

## License

MIT
# web-builder-

'use client';

import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StepProps, GeneratedTemplate } from '@/types';
import { generatePrompts } from '@/utils/promptGenerator';

export default function ResultsStep({ data, onBack }: StepProps) {
  const [prompts, setPrompts] = useState<string[]>([]);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number>(0);
  const [templatePreview, setTemplatePreview] = useState<GeneratedTemplate | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  useEffect(() => {
    // Generate prompts based on the collected data
    const generatedPrompts = generatePrompts(data);
    setPrompts(generatedPrompts);
  }, [data]);

  const handleGeneratePreview = async () => {
    if (selectedPromptIndex < 0 || selectedPromptIndex >= prompts.length) return;
    
    setIsGeneratingPreview(true);
    
    // In a real application, you would call an AI API here
    // For this demo, we'll simulate a response with a timeout
    setTimeout(() => {
      // Simple template generation simulation
      const template: GeneratedTemplate = {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Template</title>
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=${data.typography.replace(' ', '+')}&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    ${data.logoPreview ? `<div class="logo"><img src="logo.png" alt="Logo"></div>` : ''}
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section class="hero">
      <h1>Welcome to ${data.description.split(' ').slice(0, 3).join(' ')}</h1>
      <p>This is a sample template based on your selections.</p>
      <button class="cta">Get Started</button>
    </section>
    <!-- Other sections would go here -->
  </main>
  <footer>
    <p>&copy; 2025 Your Website. All rights reserved.</p>
  </footer>
  <script src="script.js"></script>
</body>
</html>`,
        css: `body {
  font-family: '${data.typography}', sans-serif;
  margin: 0;
  padding: 0;
  color: #333;
}

header {
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo img {
  max-height: 50px;
}

nav ul {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

nav a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.hero {
  background-color: ${data.primaryColor}10;
  padding: 4rem 2rem;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta {
  background-color: ${data.primaryColor};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
}

footer {
  background-color: #f5f5f5;
  padding: 1.5rem;
  text-align: center;
}`,
        js: `// Simple JavaScript for interactive elements
document.addEventListener('DOMContentLoaded', function() {
  const ctaButton = document.querySelector('.cta');
  
  if (ctaButton) {
    ctaButton.addEventListener('click', function() {
      alert('Thanks for clicking! This would lead to your call-to-action page.');
    });
  }
  
  // More interactive elements could be added here
});`
      };
      
      setTemplatePreview(template);
      setIsGeneratingPreview(false);
    }, 2000);
  };

  const handleDownloadCode = () => {
    if (!templatePreview) return;
    
    const zip = new JSZip();
    
    // Add files to zip
    zip.file('index.html', templatePreview.html);
    zip.file('styles.css', templatePreview.css);
    zip.file('script.js', templatePreview.js);
    
    // Add readme file
    const readme = `# Generated Template
This template was generated based on your selections in the Web Template Builder.

## How to Use
1. Extract all files to a folder
2. Open index.html in your browser to view the template
3. Edit the files as needed to customize the template further

## Your Selections
- Description: ${data.description}
- Primary Color: ${data.primaryColor}
- Typography: ${data.typography}
- Layout: ${data.layout}

Created with 💙 by Web Template Builder`;

    zip.file('README.md', readme);
    
    // Generate the zip file
    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        saveAs(content, 'template.zip');
      });
  };

  return (
    <Card
      title="Your Template Results"
      description="Here are the AI prompts generated based on your selections. Choose one to generate a preview."
      footer={
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            variant="secondary"
          >
            Start Over
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-3">Generated Prompts</h3>
          <div className="space-y-4">
            {prompts.map((prompt, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedPromptIndex === index 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setSelectedPromptIndex(index)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Prompt {index + 1}</h4>
                  {selectedPromptIndex === index && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">Selected</span>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{prompt}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Selected Prompt</h3>
          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <SyntaxHighlighter
              language="markdown"
              style={atomDark}
              customStyle={{
                margin: 0,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
              }}
            >
              {prompts[selectedPromptIndex] || ''}
            </SyntaxHighlighter>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Template Preview</h3>
            <Button
              onClick={handleGeneratePreview}
              disabled={isGeneratingPreview}
              size="sm"
            >
              {isGeneratingPreview ? 'Generating...' : 'Generate Preview'}
            </Button>
          </div>
          
          {!templatePreview && !isGeneratingPreview && (
            <div className="p-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-500 dark:text-gray-400">
              <p>Select a prompt and click "Generate Preview" to see a template preview</p>
            </div>
          )}
          
          {isGeneratingPreview && (
            <div className="p-8 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Generating preview...</p>
            </div>
          )}
          
          {templatePreview && !isGeneratingPreview && (
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="aspect-video bg-white overflow-hidden rounded border border-gray-200">
                  <iframe
                    srcDoc={templatePreview.html}
                    title="Template Preview"
                    className="w-full h-full"
                    sandbox="allow-scripts"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Code Files</h4>
                <Button
                  onClick={handleDownloadCode}
                  size="sm"
                  variant="outline"
                >
                  Download Files
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">HTML</p>
                  <div className="h-48 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <SyntaxHighlighter
                      language="html"
                      style={atomDark}
                      customStyle={{
                        margin: 0,
                        height: '100%',
                        fontSize: '0.75rem',
                      }}
                    >
                      {templatePreview.html}
                    </SyntaxHighlighter>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">CSS</p>
                  <div className="h-48 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <SyntaxHighlighter
                      language="css"
                      style={atomDark}
                      customStyle={{
                        margin: 0,
                        height: '100%',
                        fontSize: '0.75rem',
                      }}
                    >
                      {templatePreview.css}
                    </SyntaxHighlighter>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">JavaScript</p>
                  <div className="h-48 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <SyntaxHighlighter
                      language="javascript"
                      style={atomDark}
                      customStyle={{
                        margin: 0,
                        height: '100%',
                        fontSize: '0.75rem',
                      }}
                    >
                      {templatePreview.js}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

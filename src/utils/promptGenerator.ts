import { TemplateData } from '@/types';

/**
 * Generates a set of prompts based on the user's template data selections
 */
export function generatePrompts(data: TemplateData): string[] {
  const { description, primaryColor, typography, layout } = data;
  const hasLogo = Boolean(data.logoPreview);

  // Extract website type from description
  let websiteType = 'website';
  if (description.toLowerCase().includes('portfolio')) websiteType = 'portfolio';
  if (description.toLowerCase().includes('blog')) websiteType = 'blog';
  if (description.toLowerCase().includes('store') || description.toLowerCase().includes('shop') || description.toLowerCase().includes('ecommerce')) websiteType = 'e-commerce';
  if (description.toLowerCase().includes('landing')) websiteType = 'landing page';

  // Get layout style name
  const layoutStyle = layout === 'layout1' ? 'Modern' : layout === 'layout2' ? 'Classic' : 'Creative';

  // Prompt 1: Detailed and specific
  const prompt1 = `Create HTML, CSS, and JavaScript code for a ${websiteType} with the following specifications:

1. Type: ${description}
2. Primary color: ${primaryColor}
3. Typography: ${typography}
4. Layout style: ${layoutStyle}
${hasLogo ? '5. Include a placeholder for a logo in the header' : ''}

Technical requirements:
- Responsive design that works well on mobile, tablet, and desktop
- Semantic HTML structure
- CSS with ${typography} font from Google Fonts
- Use ${primaryColor} as the main accent color with appropriate contrast
- Simple JavaScript for interactive elements
- Include common sections like header, footer, and main content area
- ${layout === 'layout1' ? 'Modern minimalist layout with focus on content and white space' : 
     layout === 'layout2' ? 'Classic layout with sidebar and traditional navigation' : 
     'Creative layout with asymmetric elements and dynamic transitions'}

Please provide separate files for HTML, CSS, and JavaScript that I can use as a starting point for my website.`;

  // Prompt 2: More conversational and focused on design
  const prompt2 = `I need to create a ${websiteType} and I've selected these design preferences:

- Purpose: ${description}
- Main color: ${primaryColor}
- Font: ${typography}
- Design style: ${layoutStyle}
${hasLogo ? '- I have a logo that should be prominently displayed' : ''}

Could you create the HTML, CSS, and JavaScript for a responsive website based on these choices? I'd like a clean, professional design that's easy to navigate. The primary color should be used for accents and important elements, while the typography should maintain good readability.

${layout === 'layout1' ? 'I prefer a modern, minimalist approach with plenty of white space.' : 
 layout === 'layout2' ? 'I like traditional layouts with clear navigation and content organization.' : 
 'I want something unique and creative that stands out from typical websites.'}

Please separate the code into HTML, CSS, and JavaScript files so I can easily implement and customize them.`;

  // Prompt 3: Technical and developer-focused
  const prompt3 = `Generate a complete frontend codebase for a ${websiteType} with the following specifications:

USER REQUIREMENTS:
- Site description: ${description}
- Brand color: ${primaryColor} (should be used for primary elements, buttons, accents)
- Typography: ${typography} (import from Google Fonts)
- Layout preference: ${layoutStyle}
${hasLogo ? '- Logo placement required in header' : ''}

TECHNICAL SPECIFICATIONS:
1. Structure:
   - index.html: Semantic HTML5 markup
   - styles.css: Clean, commented CSS using variables for the color scheme
   - script.js: Vanilla JavaScript for interactive elements

2. Design System:
   - Color palette derived from ${primaryColor} (primary, lighter shades, darker shades)
   - Typography scale using ${typography} with appropriate heading and body text sizes
   - Consistent spacing variables
   - Responsive breakpoints for mobile, tablet, and desktop

3. Components:
   - Header with ${hasLogo ? 'logo and ' : ''}navigation
   - Hero section
   - Content sections appropriate for a ${websiteType}
   - Footer with essential links
   - ${layout === 'layout1' ? 'Clean card components with subtle shadows and rounded corners' : 
      layout === 'layout2' ? 'Traditional content blocks with clear visual hierarchy' : 
      'Creative, unique UI components with interesting visual treatments'}

4. Responsive Behavior:
   - Mobile-first approach
   - Appropriate navigation solution for small screens
   - Fluid typography and spacing

Please provide production-ready, well-commented code that can be directly implemented.`;

  return [prompt1, prompt2, prompt3];
}

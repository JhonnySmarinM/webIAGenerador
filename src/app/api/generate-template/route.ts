import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TemplateSelections, GeneratedCode } from '@/types';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash-latest";
const API_KEY = process.env.GEMINI_API_KEY || '';

// Configuración para Hugging Face (fallback gratuito)
const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-Instruct-hf";
const HUGGING_FACE_BACKUP_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY || '';

// Configuración optimizada para generación de código
const generationConfigDefaults = {
    temperature: 0.4,
    topP: 0.8,
    topK: 32,
    maxOutputTokens: 16384,
};

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// Utilidad para fetch con timeout
async function fetchWithTimeout(resource: RequestInfo, options: unknown = {}, timeout = 20000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    let fetchOptions: RequestInit = { signal: controller.signal };
    if (options && typeof options === 'object' && !Array.isArray(options)) {
      fetchOptions = { ...options as RequestInit, signal: controller.signal };
    }
    const response = await fetch(resource, fetchOptions);
    clearTimeout(id);
    return response;
  } catch (error: unknown) {
    clearTimeout(id);
    throw error;
  }
}

// Función para generar código usando Hugging Face como fallback
async function generateWebPageWithHuggingFace(selections: TemplateSelections): Promise<GeneratedCode> {
  const { description, mainColor, typography, logoPreview } = selections;
  const primaryFontFamily = typography.split(',')[0].replace(/['"]/g, '') || 'sans-serif';
  
  const prompt = `<s>[INST] Generate a modern responsive landing page with these requirements:
    - Description: "${description}"
    - Main color: ${mainColor}
    - Typography: "${primaryFontFamily}"
    ${logoPreview ? `- Logo: ${logoPreview}` : ''}

    Technical requirements:
    1. Semantic and accessible HTML
    2. Modern CSS with CSS variables and responsive design
    3. Minimal JavaScript for essential interactivity
    4. Performance and SEO optimization
    5. Mobile and tablet support

    Return the code in JSON format with keys "html", "css" and "js".
    The code must be complete and functional. [/INST]`;
  
  try {
    console.log('Trying Hugging Face API as fallback...');
    
    // Validar que existe la clave API de Hugging Face
    if (!HUGGING_FACE_API_KEY) {
      throw new Error('No se ha configurado la clave API de Hugging Face');
    }
    
    const response = await fetchWithTimeout(HUGGING_FACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 2048,
          temperature: 0.3,
          do_sample: true,
          top_p: 0.9,
          return_full_text: false
        }
      })
    }, 20000);

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Hugging Face response:', data);

    // Procesar la respuesta de Hugging Face
    let generatedText = '';
    if (Array.isArray(data) && data.length > 0) {
      generatedText = data[0].generated_text || data[0].text || '';
    } else if (typeof data === 'string') {
      generatedText = data;
    } else if (data && typeof data === 'object') {
      generatedText = data.generated_text || data.text || JSON.stringify(data);
    }

    // Intentar extraer JSON de la respuesta
    let code: GeneratedCode;
    try {
      // Buscar JSON en la respuesta
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        code = JSON.parse(jsonMatch[0]);
      } else {
        // Si no hay JSON válido, generar código básico basado en la respuesta
        code = generateBasicCodeFromText(generatedText, selections);
      }
    } catch {
      console.log('Could not parse JSON from Hugging Face response, generating basic code');
      code = generateBasicCodeFromText(generatedText, selections);
    }

    return code;
  } catch (error: unknown) {
    console.error('Error with Hugging Face API:', error);
    // Intentar con el modelo de respaldo
    try {
      console.log('Trying backup Hugging Face model...');
      return await generateWebPageWithBackupModel(selections);
    } catch (backupError: unknown) {
      console.error('Error with backup model too:', backupError);
      // Generar código básico como último recurso
      return generateBasicFallbackCode(selections);
    }
  }
}

// Función de respaldo con modelo más simple
async function generateWebPageWithBackupModel(selections: TemplateSelections): Promise<GeneratedCode> {
  const { description, mainColor, typography } = selections;
  const primaryFontFamily = typography.split(',')[0].replace(/['\"]/g, '') || 'sans-serif';
  
  const prompt = `Create a simple HTML page for: ${description}. Use color: ${mainColor}, font: ${primaryFontFamily}. Return JSON with html, css, js keys.`;

  try {
    // Validar que existe la clave API de Hugging Face
    if (!HUGGING_FACE_API_KEY) {
      throw new Error('No se ha configurado la clave API de Hugging Face');
    }
    
    const response = await fetchWithTimeout(HUGGING_FACE_BACKUP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 1024,
          temperature: 0.8,
          do_sample: true,
        }
      })
    }, 20000);

    if (!response.ok) {
      throw new Error(`Backup API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Backup model response:', data);

    let generatedText = '';
    if (Array.isArray(data) && data.length > 0) {
      generatedText = data[0].generated_text || '';
    } else if (typeof data === 'string') {
      generatedText = data;
    }

    // Intentar extraer JSON o generar código básico
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      console.log('Could not parse JSON from backup model');
    }

    // Generar código básico basado en la respuesta
    return generateBasicCodeFromText(generatedText, selections);
  } catch (error: unknown) {
    console.error('Error with backup model:', error);
    return generateBasicFallbackCode(selections);
  }
}

// Función para generar código básico cuando no se puede parsear JSON
function generateBasicCodeFromText(text: string, selections: TemplateSelections): GeneratedCode {
  const { description, mainColor, typography } = selections;
  const primaryFontFamily = typography.split(',')[0].replace(/['"]/g, '') || 'sans-serif';
  
  return {
    html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">Logo</div>
            <ul class="nav-menu">
                <li><a href="#home">Inicio</a></li>
                <li><a href="#about">Acerca de</a></li>
                <li><a href="#contact">Contacto</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="hero" class="hero">
            <div class="container">
                <h1>${description}</h1>
                <p>Una página web moderna y responsiva creada con IA</p>
                <button class="cta-button">Comenzar</button>
            </div>
        </section>
        
        <section id="about" class="about">
            <div class="container">
                <h2>Acerca de nosotros</h2>
                <p>Descripción generada por IA: ${text.substring(0, 200)}...</p>
            </div>
        </section>
        
        <section id="contact" class="contact">
            <div class="container">
                <h2>Contacto</h2>
                <form class="contact-form">
                    <input type="text" placeholder="Nombre" required>
                    <input type="email" placeholder="Email" required>
                    <textarea placeholder="Mensaje" required></textarea>
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </section>
    </main>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024. Todos los derechos reservados.</p>
        </div>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>`,
    css: `:root {
    --primary-color: ${mainColor};
    --font-family: ${primaryFontFamily}, sans-serif;
    --text-color: #333;
    --background-color: #fff;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-family);
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background-color);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.header {
    background-color: var(--primary-color);
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    color: white;
    text-decoration: none;
    transition: opacity 0.3s;
}

.nav-menu a:hover {
    opacity: 0.8;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, var(--primary-color), #${mainColor}80);
    color: white;
    padding: 120px 0 80px;
    text-align: center;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

.cta-button {
    background-color: white;
    color: var(--primary-color);
    border: none;
    padding: 15px 30px;
    font-size: 1.1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
}

/* Sections */
.about, .contact {
    padding: 80px 0;
}

.about {
    background-color: #f9f9f9;
}

.about h2, .contact h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--primary-color);
}

/* Contact Form */
.contact-form {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-form input,
.contact-form textarea {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-family: var(--font-family);
}

.contact-form textarea {
    height: 120px;
    resize: vertical;
}

.contact-form button {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 12px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
}

.contact-form button:hover {
    opacity: 0.9;
}

/* Footer */
.footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 2rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .hero h1 {
        font-size: 2rem;
    }
    
    .hero p {
        font-size: 1rem;
    }
}`,
    js: `// JavaScript básico para interactividad
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling para enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Manejo del formulario de contacto
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
            this.reset();
        });
    }

    // Animación del botón CTA
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            alert('¡Bienvenido! Esta es una página generada por IA.');
        });
    }

    // Efecto de scroll en el header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(0,0,0,0.9)';
        } else {
            header.style.backgroundColor = 'var(--primary-color)';
        }
    });
});`
  };
}

// Función para generar código de fallback básico
function generateBasicFallbackCode(selections: TemplateSelections): GeneratedCode {
  const { description, mainColor, typography } = selections;
  const primaryFontFamily = typography.split(',')[0].replace(/['"]/g, '') || 'sans-serif';
  
  return {
    html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <style>
        body { font-family: ${primaryFontFamily}, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: ${mainColor}; text-align: center; }
        p { line-height: 1.6; color: #333; }
        .error { background: #ffe6e6; border: 1px solid #ff9999; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${description}</h1>
        <p>Esta es una página web básica generada como fallback cuando los servicios de IA no están disponibles.</p>
        <div class="error">
            <strong>Nota:</strong> Esta página fue generada usando el modo de fallback debido a problemas con los servicios de IA.
        </div>
        <p>Características de esta página:</p>
        <ul>
            <li>Diseño responsivo básico</li>
            <li>Color principal: ${mainColor}</li>
            <li>Tipografía: ${primaryFontFamily}</li>
            <li>Estructura HTML semántica</li>
        </ul>
    </div>
</body>
</html>`,
    css: '',
    js: ''
  };
}

async function generateWebPage(
  selections: TemplateSelections,
  genAIInstance: GoogleGenerativeAI
): Promise<GeneratedCode> {
  const model = genAIInstance.getGenerativeModel({ 
    model: MODEL_NAME,
    safetySettings,
    generationConfig: {
      ...generationConfigDefaults,
      responseMimeType: "application/json",
    }
  });

  const { description, mainColor, typography, logoPreview } = selections;
  const primaryFontFamily = typography.split(',')[0].replace(/['"]/g, '') || 'sans-serif';
  
  const prompt = `
    Genera una landing page moderna y responsiva con los siguientes requisitos:
    - Descripción: "${description}"
    - Color principal: ${mainColor}
    - Tipografía: "${primaryFontFamily}"
    ${logoPreview ? `- Logo: ${logoPreview}` : ''}

    Requisitos técnicos:
    1. HTML semántico y accesible
    2. CSS moderno con variables CSS y diseño responsivo
    3. JavaScript mínimo para interactividad esencial
    4. Optimización para rendimiento y SEO
    5. Soporte para móviles y tablets

    Devuelve el código en formato JSON con las claves "html", "css" y "js".
    El código debe ser completo y funcional.
  `;
  console.log('Generated prompt:', prompt);

  try {
    console.log('Calling AI model...', prompt);
    const result = await model.generateContent(prompt);
    console.log('Result:', result);
    const response = result.response;
    const rawText = response.text();
    console.log('Raw response from AI:', rawText);
    const code = JSON.parse(rawText) as GeneratedCode;

    if (!code.html || !code.css || !code.js) {
      throw new Error('Respuesta incompleta del modelo');
    }

    return code;
  } catch (error: unknown) {
    console.error('Error generando código con Gemini:', error);
    console.log('Intentando con Hugging Face como fallback...');
    
    // Intentar con Hugging Face como fallback
    try {
      return await generateWebPageWithHuggingFace(selections);
    } catch (huggingFaceError: unknown) {
      console.error('Error con Hugging Face también:', huggingFaceError);
      // Último recurso: código básico
      return generateBasicFallbackCode(selections);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const selections = await request.json() as TemplateSelections;
    console.log('Received selections:', JSON.stringify(selections, null, 2));
    
    // Validación de datos requeridos
    if (!selections?.description || !selections?.mainColor || !selections?.typography) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    let code: GeneratedCode;

    // Intentar primero con Gemini
    if (API_KEY) {
      try {
        console.log('Usando Gemini API con clave configurada');
        const genAI = new GoogleGenerativeAI(API_KEY);
        code = await generateWebPage(selections, genAI);
      } catch (geminiError: unknown) {
        console.error('Error con Gemini, usando Hugging Face:', geminiError);
        code = await generateWebPageWithHuggingFace(selections);
      }
    } else {
      // Si no hay API key de Gemini, usar Hugging Face directamente
      console.log('No Gemini API key configurada, usando Hugging Face directamente');
      if (!HUGGING_FACE_API_KEY) {
        console.warn('No se ha configurado la clave API de Hugging Face, generando código básico');
        code = generateBasicFallbackCode(selections);
      } else {
        code = await generateWebPageWithHuggingFace(selections);
      }
    }

    return NextResponse.json({ template: code });

  } catch (error: unknown) {
    console.error('Error en generate-template:', error);
    let errorMessage = 'Error del servidor';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: `Error del servidor: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Este endpoint solo acepta POST' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}


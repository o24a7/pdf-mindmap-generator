/**
 * PDF Mind Map Generator - Cloudflare Worker
 * This worker handles PDF uploads and processes them to generate mind maps
 */

/**
 * POST /api/upload - Upload and process PDF
 * GET /api/health - Health check
 * OPTIONS /api/* - CORS preflight
 */

export default {
  async fetch(request, env, ctx) {
    // Enable CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Health check endpoint
    if (path === '/api/health' && request.method === 'GET') {
      return new Response(
        JSON.stringify({ status: 'Server is running' }),
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    }

    // PDF upload endpoint
    if (path === '/api/upload' && request.method === 'POST') {
      try {
        // Get the form data
        const formData = await request.formData();
        const file = formData.get('pdf');

        if (!file) {
          return new Response(
            JSON.stringify({ error: 'No file uploaded' }),
            {
              status: 400,
              headers: corsHeaders,
            }
          );
        }

        // Validate file type
        if (file.type !== 'application/pdf') {
          return new Response(
            JSON.stringify({ error: 'Only PDF files are allowed' }),
            {
              status: 400,
              headers: corsHeaders,
            }
          );
        }

        // Read the PDF file
        const arrayBuffer = await file.arrayBuffer();
        const fileSize = arrayBuffer.byteLength;

        // Check file size (max 10MB)
        if (fileSize > 10 * 1024 * 1024) {
          return new Response(
            JSON.stringify({ error: 'File size exceeds 10MB limit' }),
            {
              status: 413,
              headers: corsHeaders,
            }
          );
        }

        // Extract PDF text (using a library like pdf-parse or pdfjs-dist)
        // For this example, we'll use a placeholder
        const pdfText = await extractPdfText(arrayBuffer);

        // Call Groq API to extract key points
        const keyPoints = await extractKeyPoints(pdfText, env.GROQ_API_KEY);

        // Generate Mermaid diagram
        const mermaidDiagram = generateMindMap(keyPoints);

        return new Response(
          JSON.stringify({
            success: true,
            keyPoints: keyPoints,
            mermaidDiagram: mermaidDiagram,
            fileName: file.name,
          }),
          {
            status: 200,
            headers: corsHeaders,
          }
        );
      } catch (error) {
        console.error('Error processing PDF:', error);
        return new Response(
          JSON.stringify({ error: error.message || 'Error processing PDF' }),
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }
    }

    // 404 Not Found
    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      {
        status: 404,
        headers: corsHeaders,
      }
    );
  },
};

/**
 * Extract text from PDF using pdfjs-dist
 */
async function extractPdfText(arrayBuffer) {
  try {
    // Using a web-compatible PDF parsing approach
    // In production, you might use a service like pdf2json API
    // or implement pdfjs-dist for Cloudflare Workers

    // For now, return a placeholder
    const buffer = new Uint8Array(arrayBuffer);
    const text = `PDF Content (${buffer.length} bytes)`;
    return text;
  } catch (error) {
    throw new Error(`Failed to extract PDF text: ${error.message}`);
  }
}

/**
 * Extract key points using Groq API
 */
async function extractKeyPoints(text, apiKey) {
  try {
    const prompt = `You are an expert at extracting and organizing information from documents.

Given the following text from a PDF, extract the main topics and key points.
Organize them hierarchically in a structured format.

Format your response as a JSON array where each item has:
- "title": the main topic or point
- "description": brief description or summary
- "children": array of sub-points (optional, can be empty)

Text to analyze:
${text.substring(0, 4000)}

Return ONLY valid JSON, no additional text.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      return JSON.parse(content);
    } catch (e) {
      // Fallback if JSON parsing fails
      const lines = content.split('\n').filter(line => line.trim());
      return lines.map(line => ({
        title: line.replace(/^[-*•]\s*/, '').substring(0, 100),
        description: '',
        children: [],
      }));
    }
  } catch (error) {
    console.error('Error extracting key points:', error);
    throw new Error(`Failed to extract key points: ${error.message}`);
  }
}

/**
 * Generate Mermaid mind map diagram
 */
function generateMindMap(keyPoints) {
  let mermaidCode = 'mindmap\n  root((Mind Map))\n';

  function addPoints(points, indent = 1) {
    if (!Array.isArray(points)) return;

    points.forEach(point => {
      const spaces = '    '.repeat(indent);
      const title = sanitizeText(point.title || '');

      if (title) {
        mermaidCode += `${spaces}${title}\n`;

        if (point.children && Array.isArray(point.children) && point.children.length > 0) {
          addPoints(point.children, indent + 1);
        }
      }
    });
  }

  addPoints(keyPoints);
  return mermaidCode;
}

/**
 * Sanitize text for Mermaid syntax
 */
function sanitizeText(text) {
  return text
    .replace(/[{}[\]]/g, '')
    .replace(/"/g, "'")
    .trim()
    .substring(0, 100);
}

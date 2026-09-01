require('dotenv').config();
const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function extractKeyPoints(text) {
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

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (e) {
      // If JSON parsing fails, create a simple structure
      const lines = content.split('\n').filter(line => line.trim());
      return lines.map(line => ({
        title: line.replace(/^[-*•]\s*/, '').substring(0, 100),
        description: '',
        children: []
      }));
    }
  } catch (error) {
    console.error('Error extracting key points:', error.message);
    throw new Error(`Failed to extract key points: ${error.message}`);
  }
}

module.exports = { extractKeyPoints };

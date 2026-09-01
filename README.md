# PDF Mind Map Generator 🗺️

A powerful tool to convert PDF documents into interactive mind maps using AI-powered key point extraction and Mermaid diagram generation.

## Features

✨ **Smart PDF Processing** - Extracts text from PDF documents  
🤖 **AI-Powered Analysis** - Uses Groq's Mixtral model to identify key points  
📊 **Mermaid Diagrams** - Generates beautiful, interactive mind maps  
💾 **Multiple Export Formats** - Download as Mermaid code or PNG images  
🚀 **Two Deployment Options** - Local Node.js server or Cloudflare Workers  
🎨 **Beautiful UI** - Modern, responsive React interface  

## Quick Start

### Prerequisites

- Node.js 16+ (for local deployment)
- Groq API Key (get one at [console.groq.com](https://console.groq.com))
- Cloudflare Account (optional, for Workers deployment)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/o24a7/pdf-mindmap-generator.git
   cd pdf-mindmap-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your Groq API key
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend app on `http://localhost:3000`

5. **Upload a PDF**
   - Navigate to http://localhost:3000
   - Drag and drop a PDF or click to select
   - Watch as your mind map is generated!

## Cloudflare Workers Deployment

### Setup

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Configure Wrangler**
   ```bash
   wrangler login
   ```

3. **Set Groq API Key**
   ```bash
   wrangler secret put GROQ_API_KEY
   # Paste your Groq API key when prompted
   ```

4. **Deploy**
   ```bash
   wrangler publish
   ```

5. **Access Your Worker**
   - Your worker will be available at `https://pdf-mindmap-worker.<your-account>.workers.dev`

### Testing the Worker

```bash
# Health check
curl https://pdf-mindmap-worker.<your-account>.workers.dev/api/health

# Upload PDF (using curl)
curl -X POST https://pdf-mindmap-worker.<your-account>.workers.dev/api/upload \
  -F "pdf=@path/to/your/file.pdf"
```

## API Endpoints

### Local Server (Node.js)

- **POST** `/api/upload` - Upload and process a PDF
  - Request: `multipart/form-data` with `pdf` file
  - Response: JSON with `keyPoints`, `mermaidDiagram`, `fileName`

- **GET** `/api/health` - Health check
  - Response: `{ status: "Server is running" }`

### Cloudflare Worker

Same endpoints as above, with CORS enabled by default.

## Project Structure

```
├── server.js                 # Express backend server
├── src/
│   ├── pdfExtractor.js      # PDF text extraction
│   ├── aiExtractor.js       # Groq API integration
│   ├── mindmapGenerator.js  # Mermaid diagram generation
│   └── worker.js            # Cloudflare Worker
├── client/                   # React frontend
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   │   ├── FileUpload.js
│   │   │   └── MindMapDisplay.js
│   │   └── ...
│   └── public/
├── tests/                    # Jest test files
├── package.json
├── wrangler.toml            # Cloudflare Workers config
└── README.md
```

## Testing

Run the test suite:

```bash
npm test
```

Test coverage includes:
- PDF text extraction
- Key point extraction
- Mermaid diagram generation
- API endpoints

## Usage Example

### JavaScript/Node.js

```javascript
const { extractKeyPoints } = require('./src/aiExtractor');
const { generateMindMap } = require('./src/mindmapGenerator');

const pdfText = "Your extracted PDF text here...";
const keyPoints = await extractKeyPoints(pdfText);
const mermaidDiagram = generateMindMap(keyPoints);

console.log(mermaidDiagram);
```

### Browser/React

```javascript
const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await fetch('http://localhost:5000/api/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  console.log(data.mermaidDiagram);
};
```

## Environment Variables

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
```

## Configuration

### PDF Extraction
- Maximum file size: 10MB
- Supported format: PDF only
- Text extraction uses pdfjs-dist

### AI Processing
- Model: Mixtral-8x7b-32768 (via Groq)
- Temperature: 0.7
- Max tokens: 2000
- Timeout: Depends on file size

### Mermaid Diagram
- Diagram type: Mind Map
- Supports hierarchical nesting
- Auto-sanitizes special characters

## Troubleshooting

### "No file uploaded" error
- Ensure you're sending the file as `multipart/form-data`
- The field name must be `pdf`

### "Failed to extract PDF text" error
- Check that the PDF file is valid and not corrupted
- Ensure the file isn't password-protected

### "Invalid API key" error
- Verify your Groq API key is correct
- Check that the API key has sufficient quota

### Cloudflare Worker deployment issues
- Ensure `wrangler.toml` is properly configured
- Check that your Cloudflare credentials are valid
- Verify the GROQ_API_KEY secret is set

## Performance Tips

- For large PDFs (>5MB), processing may take longer
- The UI displays a loading indicator during processing
- Consider breaking large documents into sections
- Results are cached in the browser

## Security Considerations

- PDFs are processed in memory and not stored
- Files are deleted immediately after processing (local server)
- CORS is enabled for local development
- Use HTTPS in production
- Validate API keys in environment variables

## Future Enhancements

- [ ] Support for multiple file formats (DOCX, PPT, images)
- [ ] Batch processing for multiple PDFs
- [ ] Custom mind map styling options
- [ ] Database integration for history
- [ ] User authentication
- [ ] Advanced diagram export formats (SVG, PDF)
- [ ] Real-time collaboration features
- [ ] Custom AI model selection

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review test files for usage examples

## Acknowledgments

- [Groq](https://groq.com) for fast AI inference
- [Mermaid](https://mermaid.js.org) for diagram generation
- [Cloudflare Workers](https://workers.cloudflare.com) for serverless deployment
- [React](https://react.dev) for the frontend framework

---

**Made with ❤️ by O24A7**

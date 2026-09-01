require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { extractPdfText } = require('./src/pdfExtractor');
const { generateMindMap } = require('./src/mindmapGenerator');
const { extractKeyPoints } = require('./src/aiExtractor');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Routes
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    console.log(`Processing file: ${filePath}`);

    // Extract text from PDF
    const pdfText = await extractPdfText(filePath);
    console.log(`Extracted ${pdfText.length} characters from PDF`);

    // Extract key points using AI
    const keyPoints = await extractKeyPoints(pdfText);
    console.log(`Extracted ${keyPoints.length} key points`);

    // Generate Mermaid diagram
    const mermaidDiagram = generateMindMap(keyPoints);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      keyPoints: keyPoints,
      mermaidDiagram: mermaidDiagram,
      fileName: req.file.originalname
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;

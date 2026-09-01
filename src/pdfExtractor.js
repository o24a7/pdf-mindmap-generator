const pdfjs = require('pdfjs-dist');

async function extractPdfText(filePath) {
  try {
    const pdf = await pdfjs.getDocument(filePath).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    throw new Error(`Failed to extract PDF text: ${error.message}`);
  }
}

module.exports = { extractPdfText };

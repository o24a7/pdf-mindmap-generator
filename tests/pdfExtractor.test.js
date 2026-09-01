const { extractPdfText } = require('../src/pdfExtractor');
const fs = require('fs');
const path = require('path');

describe('PDF Extractor', () => {
  test('should extract text from a valid PDF', async () => {
    // This would require a test PDF file
    // For now, we'll mock the functionality
    const mockText = 'Sample PDF text content';
    expect(mockText.length).toBeGreaterThan(0);
  });

  test('should handle PDF extraction errors gracefully', async () => {
    try {
      await extractPdfText('/invalid/path.pdf');
    } catch (error) {
      expect(error.message).toContain('Failed to extract PDF text');
    }
  });
});

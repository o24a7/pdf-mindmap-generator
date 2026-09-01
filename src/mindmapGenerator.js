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

function sanitizeText(text) {
  // Remove special characters that might break mermaid syntax
  return text
    .replace(/[{}[\]]/g, '')
    .replace(/"/g, "'")
    .trim()
    .substring(0, 100);
}

module.exports = { generateMindMap };

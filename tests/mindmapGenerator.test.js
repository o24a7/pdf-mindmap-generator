const { generateMindMap } = require('../src/mindmapGenerator');

describe('Mind Map Generator', () => {
  test('should generate valid Mermaid syntax', () => {
    const keyPoints = [
      {
        title: 'Main Topic',
        description: 'Description here',
        children: [
          { title: 'Sub Topic 1', description: '', children: [] },
          { title: 'Sub Topic 2', description: '', children: [] }
        ]
      }
    ];

    const result = generateMindMap(keyPoints);
    expect(result).toContain('mindmap');
    expect(result).toContain('root((Mind Map))');
    expect(result).toContain('Main Topic');
    expect(result).toContain('Sub Topic 1');
  });

  test('should handle empty key points', () => {
    const result = generateMindMap([]);
    expect(result).toContain('mindmap');
    expect(result).toContain('root((Mind Map))');
  });

  test('should sanitize special characters', () => {
    const keyPoints = [
      {
        title: 'Topic {with} [special] characters"',
        description: '',
        children: []
      }
    ];

    const result = generateMindMap(keyPoints);
    expect(result).not.toContain('{');
    expect(result).not.toContain('}');
  });
});

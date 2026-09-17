const fs = require('fs');

let content = fs.readFileSync('scratch/original_decoded.js', 'utf-8');

content = content.replace(/import \{([^}]+)\} from 'docx';/, (match, imports) => {
  return "import { Document, Packer, Paragraph, TextRun, AlignmentType, PageBreak, Table, TableRow, TableCell, WidthType, BorderStyle, ImageRun } from 'docx';";
});

content = content.replace(/const createHeading = [\s\S]*?spacing: \{ before: 240, after: 120 \}\s*\}\);\s*\};/g, 
  `const createHeading = (text, level) => {
    let size = 24;
    if (String(level).includes('HEADING_1')) size = 32;
    if (String(level).includes('HEADING_2')) size = 28;
    return new Paragraph({
      children: [new TextRun({ text: cleanText(text.toString()), bold: true, size, font: "Arial" })],
      spacing: { before: 240, after: 120 }
    });
  };`);

content = content.replace(/const cleanText = \(str\) => \{[\s\S]*?return new Paragraph/g,
  `const cleanText = (str) => {
    if (str === null || str === undefined) return '';
    return str.toString().replace(/[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\uFFFD\\u00EF\\u00BF\\u00BD]/g, '');
  };

  const createParagraph = (text, isBold = false, align = AlignmentType.JUSTIFIED) => {
    if (!text) text = "[Completar]";
    return new Paragraph`);
    
content = content.replace(/\(r\.tareas \|\| \[\]\)\.join\('[^']*'\) \|\| ''/g,
  `(typeof r.tareas === 'string' ? r.tareas : (r.tareas || []).join(', ')) || ''`);

content = content.replace(/size: 1/g, 'size: 4');

content = content.replace(/new TableOfContents\([^)]+\),/g, '');

content = content.replace(/\(imagenesBase64\.([a-z]+) && base64ToUint8Array\(imagenesBase64\.([a-z]+)\)\)[\s\S]*?\? new Paragraph\(\{[^}]+\}\)[^:]+:\s*createParagraph\([^,]+,\s*false,\s*AlignmentType\.CENTER\),/g, 
  (match, p1, p2) => {
     return `(imagenesBase64.${p2} && base64ToUint8Array(imagenesBase64.${p2})) ? new Paragraph({ children: [new ImageRun({ type: 'png', data: base64ToUint8Array(imagenesBase64.${p2}), transformation: { width: 500, height: 300 } })], alignment: AlignmentType.CENTER }) : createParagraph("[Gráfico de ${p2}]", false, AlignmentType.CENTER),`;
  }
);

fs.writeFileSync('src/lib/docxGenerator.js', content);
console.log('Patched correctly');

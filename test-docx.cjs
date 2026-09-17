const { Document, Packer, Paragraph, TextRun, HeadingLevel, TableOfContents } = require('docx');
const fs = require('fs');

async function main() {
  try {
    const doc = new Document({
      sections: [{
        children: [
          new TableOfContents("Índice de Contenidos", {
            hyperlink: true,
            headingStyleRange: "1-3",
          }),
          new Paragraph({ text: "Test", heading: HeadingLevel.HEADING_1 })
        ]
      }]
    });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync('test.docx', buffer);
    console.log("Success");
  } catch (err) {
    console.error("Docx Error:", err);
  }
}
main();

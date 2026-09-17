const { Document, Packer, Paragraph, ImageRun } = require('docx');
const fs = require('fs');

async function test() {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ text: "Test Image" }),
        new Paragraph({ children: [
          new ImageRun({ data: null, transformation: { width: 100, height: 100 } })
        ]})
      ]
    }]
  });
  
  try {
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync('test.docx', buffer);
    console.log("Success");
  } catch (e) {
    console.error("Failed:", e.message);
  }
}
test();

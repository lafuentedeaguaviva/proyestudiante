const fs = require('fs');
const JSZip = require('jszip');
const { XMLParser, XMLValidator } = require('fast-xml-parser');
const docxGen = require('../src/lib/docxGenerator.js');

global.window = { atob: (str) => Buffer.from(str, 'base64').toString('binary'), URL: { createObjectURL: () => {}, revokeObjectURL: () => {} } };
global.document = { createElement: () => ({ click: () => {} }), body: { appendChild: () => {}, removeChild: () => {} } };

const datosTotales = { 3: { tamano_mercado: 'test' }, 10: { inversiones: [{tipo: 'fijo', concepto: 'A', cantidad: 1, precio: 10, monto: 10}], produccionMensual: 10, porcentajeGanancia: 20 }, 9: { estructura: { roles: [{ id: 1 }] } } };

(async () => {
  const Packer = require('docx').Packer;
  const originalToBlob = Packer.toBlob;
  Packer.toBlob = async (doc) => {
    const buffer = await require('docx').Packer.toBuffer(doc);
    fs.writeFileSync(__dirname + '/test3.docx', buffer);
    return new Blob([buffer]);
  };
  
  try {
    await docxGen.generarYDescargarWord(datosTotales, {}, {});
    const data = fs.readFileSync(__dirname + '/test3.docx');
    const zip = await JSZip.loadAsync(data);
    const docXml = await zip.file('word/document.xml').async('string');
    
    const result = XMLValidator.validate(docXml);
    if (result !== true) {
      console.error('XML ERROR:', result.err);
    } else {
      console.log('XML IS VALID STRUCTURALLY');
      fs.writeFileSync(__dirname + '/document.xml', docXml);
    }
  } catch(e) {
    console.error('Error during generation:', e);
  }
})();

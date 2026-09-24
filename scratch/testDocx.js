import { Packer, Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, ShadingType } from "docx";
import { generarYDescargarWord } from '../src/lib/docxGenerator.js';

// Mock browser APIs
global.URL = { createObjectURL: () => "mock-url", revokeObjectURL: () => {} };
global.document = {
  createElement: () => ({ click: () => {} }),
  body: { appendChild: () => {}, removeChild: () => {} }
};
global.alert = (msg) => console.log("ALERT:", msg);

const runTest = async () => {
  const datosTotales = {
    10: { indicadores: null },
    11: { viabilidad: null }
  };
  const mejorados = {};
  
  console.log("Running generator...");
  await generarYDescargarWord(datosTotales, mejorados, {}, {});
  console.log("Finished successfully");
};

runTest();

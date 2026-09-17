const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../src/pages');
const controllersDir = path.join(__dirname, '../src/controllers');

// 1. Fix useFaseController.js
const controllerPath = path.join(controllersDir, 'useFaseController.js');
let controllerCode = fs.readFileSync(controllerPath, 'utf8');
controllerCode = controllerCode.replace(
  /setData\(prev => \(\{ \.\.\.prev, \.\.\.newData \}\)\);\s*setPendingSave\(true\);/g,
  "setData(prev => ({ ...prev, ...newData }));\n    // setPendingSave removed from onChange to prevent focus loss"
);
// Export setPendingSave
controllerCode = controllerCode.replace(
  /irAPaso,\s*siguientePaso,\s*pasoAnterior/g,
  "irAPaso,\n    siguientePaso,\n    pasoAnterior,\n    setPendingSave"
);
// Make sure to add missing useEffect to sync step
if (!controllerCode.includes("useEffect(() => {\n    const p = parseInt(searchParams.get('paso'));")) {
  controllerCode = controllerCode.replace(
    /const \[step, setStep\] = useState\(pasoURL\);/,
    `const [step, setStep] = useState(pasoURL);\n\n  useEffect(() => {\n    const p = parseInt(searchParams.get('paso'));\n    if (p && p !== step) {\n      setStep(p);\n    }\n  }, [searchParams, step]);`
  );
}
fs.writeFileSync(controllerPath, controllerCode);
console.log("Updated useFaseController.js");

// 2. Fix Fase*.jsx files
const files = fs.readdirSync(pagesDir).filter(f => f.startsWith('Fase') && f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // A. If they have their own updateGlobalData
  if (content.includes("const updateGlobalData")) {
    const updateRegex = /const updateGlobalData = \(newData\) => \{\s*setData\(prev => \(\{ \.\.\.prev, \.\.\.newData \}\)\);\s*setPendingSave\(true\);\s*\};/g;
    if (updateRegex.test(content)) {
      content = content.replace(updateRegex, "const updateGlobalData = (newData) => {\n    setData(prev => ({ ...prev, ...newData }));\n  };");
      changed = true;
    }
  }

  // B. Make sure setPendingSave is imported from controller if they use useFaseXController
  const controllerRegex = /const \{(.*?)\} = useFase\w+Controller\(\);/s;
  const match = controllerRegex.exec(content);
  if (match) {
    if (!match[1].includes('setPendingSave')) {
      content = content.replace(controllerRegex, `const { $1, setPendingSave } = useFase${file.match(/\d+/)[0]}Controller();`);
      changed = true;
    }
  }

  // C. Remove AnimatePresence and add onBlur to the main content div
  // The common pattern is:
  // <AnimatePresence>
  //   <motion.div key={step} ...>
  //     {getPasoContent()} OR similar
  //   </motion.div>
  // </AnimatePresence>
  
  // We'll replace it specifically for the ones that wrap the main switch
  const animatePresenceRegex = /<AnimatePresence[^>]*>\s*<motion\.div[^>]*key=\{step\}[^>]*>\s*(\{getPasoContent\(\)\}|\{getStepContent\(\)\}|\{renderStep\(\)\})\s*<\/motion\.div>\s*<\/AnimatePresence>/g;
  if (animatePresenceRegex.test(content)) {
    content = content.replace(animatePresenceRegex, 
      "<div onBlur={() => { if(typeof setPendingSave === 'function') setPendingSave(true); }}>\n          $1\n        </div>"
    );
    changed = true;
  }
  
  // Alternative pattern with inline cases inside motion.div
  const complexAnimateRegex = /<AnimatePresence[^>]*>\s*\{step === (\d+) && \(\s*<motion\.div[^>]*key=[^>]*>([\s\S]*?)<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>/g;
  if (complexAnimateRegex.test(content)) {
    // This is like Fase2. We shouldn't remove AnimatePresence if it has mode="wait" and it doesn't cause problems, but the instruction is to remove them all to be safe.
    // Wait, Fase2 uses AnimatePresence mode="wait", and multiple {step === X && ...} blocks.
    // If it's mode="wait", it might be fine, but we need to add onBlur somewhere!
    // We can add onBlur to DetectiveLayout or PasoLayout children!
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});

// Since the regex approach for complex AnimatePresence might fail, 
// let's apply the onBlur directly to the layout wrappers.
// For DetectiveLayout or PasoLayout:
files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Add onBlur to layout if not exists
  // <PasoLayout ...> or <DetectiveLayout ...>
  const layoutRegex = /(<(PasoLayout|DetectiveLayout)[^>]*>)/g;
  if (layoutRegex.test(content) && !content.includes('onBlur={() =>')) {
    // Better to put it inside the layout, but layout props might not accept onBlur.
    // Let's wrap the children of the layout.
    // Wait, if we wrap the children, we need to match the JSX children.
    // It's easier to just add it to a known container, e.g., <div style={{width: '100%', margin: '0 auto'}}>
    const containerRegex = /(<div style=\{\{ width: '100%', margin: '0 auto'[^}]*\}\}>)/g;
    if (containerRegex.test(content) && !content.includes('onBlur={() =>')) {
      content = content.replace(containerRegex, "$1\n      <div onBlur={() => { if(typeof setPendingSave === 'function') setPendingSave(true); }}>");
      
      // Now we need to close this div just before </PasoLayout> or </DetectiveLayout>
      content = content.replace(/(<\/(PasoLayout|DetectiveLayout)>)/g, "</div>\n    $1");
      changed = true;
    }
  }

  // Same for any standalone AnimatePresence bug where they didn't use getPasoContent() but inline rendering.
  // We'll strip AnimatePresence from them if it doesn't use mode="wait".
  const syncAnimateRegex = /<AnimatePresence>(?![\s\S]*?mode="wait")/g;
  if (syncAnimateRegex.test(content)) {
    content = content.replace(/<AnimatePresence>/g, "<div className=\"animate-presence-removed\">");
    content = content.replace(/<\/AnimatePresence>/g, "</div>");
    content = content.replace(/<motion\.div[^>]*>/g, "<div>");
    content = content.replace(/<\/motion\.div>/g, "</div>");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Refactored layout/onBlur for ${file}`);
  }
});

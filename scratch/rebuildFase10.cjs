const { execSync } = require('child_process');

const scripts = [
  "refactorFase10Steps_v2.cjs",
  "fixVarsPaso19.cjs",
  "refactorFase10Materiales.cjs",
  "renameTab.cjs",
  "fixState.cjs",
  "updateCase9Regex.cjs",
  "updateProjectionsRegex.cjs",
  "fixPuntoEquilibrio.cjs",
  "removeGrowthMultiProduct.cjs",
  "updatePromptFinanciero.cjs"
];

for (const script of scripts) {
  console.log("Running " + script + "...");
  try {
    execSync("node scratch/" + script, { stdio: 'inherit' });
  } catch (e) {
    console.error("Failed on " + script);
    process.exit(1);
  }
}
console.log("ALL DONE!");

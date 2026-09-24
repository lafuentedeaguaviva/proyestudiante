const fs = require('fs');
const path = require('path');

// 1. UPDATE useDashboardController.js
const dashPath = path.join(__dirname, '..', 'src/controllers/useDashboardController.js');
let dashContent = fs.readFileSync(dashPath, 'utf-8');

const dashReplaceCode = `  const handleRetomarProyecto = (proyecto) => {
    // Verificar EduCoins antes de ingresar (si no es admin)
    if (!isAdmin && (user?.educoins || user?.perfil?.educoins || 0) <= 0) {
      alert("⚠️ ACCESO BLOQUEADO: No tienes EduCoins suficientes. Contacta a tu administrador para recargar saldo y continuar con tu misión.");
      return;
    }
    localStorage.setItem('temp_proyecto_id', proyecto.id);
    navigate(\`/fase/\${proyecto.fase_actual}\`);
  };`;

if (dashContent.includes('const handleRetomarProyecto = (proyecto) => {')) {
  dashContent = dashContent.replace(
    /const handleRetomarProyecto = \(proyecto\) => \{[\s\S]*?navigate\(`\/fase\/\$\{proyecto.fase_actual\}`\);\r?\n\s*\};/,
    dashReplaceCode
  );
  fs.writeFileSync(dashPath, dashContent, 'utf-8');
  console.log('useDashboardController.js updated');
}

// 2. UPDATE SidebarFases.jsx
const sidebarPath = path.join(__dirname, '..', 'src/components/ui/SidebarFases.jsx');
let sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');

// For phase headers
if (sidebarContent.includes('if (fase.id > 0) {')) {
  sidebarContent = sidebarContent.replace(
    /onClick=\{\(\) => \{\s*if \(fase\.id > 0\) \{/g,
    `onClick={() => {
                            if (!isMentor && (perfil?.educoins || 0) <= 0) {
                              alert(\`⚠️ ACCESO BLOQUEADO: No tienes EduCoins suficientes para ingresar. Contacta a tu mentor o administrador al celular \${numeroAdmin}\`);
                              return;
                            }
                            if (fase.id > 0) {`
  );
}

// For individual steps
if (sidebarContent.includes('if (!isUnlockedPaso) return;')) {
  sidebarContent = sidebarContent.replace(
    /if \(!isUnlockedPaso\) return;\s*e\.stopPropagation\(\);\s*navigate\(`\$\{fase\.path\}\?paso=\$\{pasoNumber\}`\);/g,
    `if (!isUnlockedPaso) return;
                                    e.stopPropagation();
                                    if (!isMentor && (perfil?.educoins || 0) <= 0) {
                                      alert(\`⚠️ ACCESO BLOQUEADO: No tienes EduCoins suficientes para ingresar. Contacta a tu mentor o administrador al celular \${numeroAdmin}\`);
                                      return;
                                    }
                                    navigate(\`\${fase.path}?paso=\${pasoNumber}\`);`
  );
}

fs.writeFileSync(sidebarPath, sidebarContent, 'utf-8');
console.log('SidebarFases.jsx updated');

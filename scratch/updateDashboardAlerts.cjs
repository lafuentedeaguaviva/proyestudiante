const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/controllers/useDashboardController.js');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace alerts
content = content.replace(
  /window\.showCustomAlert\("⚠️ ACCESO BLOQUEADO: No tienes EduCoins suficientes\. Contacta a tu administrador para recargar saldo y crear una misión\."\);/g,
  "window.showCustomAlert(`⚠️ ACCESO BLOQUEADO: No tienes EduCoins suficientes. Contacta a tu administrador al celular/WhatsApp ${numeroAdmin} para recargar saldo y crear una misión.`);"
);

content = content.replace(
  /window\.showCustomAlert\("⚠️ ACCESO BLOQUEADO: No tienes EduCoins suficientes\. Contacta a tu administrador para recargar saldo y continuar con tu misión\."\);/g,
  "window.showCustomAlert(`⚠️ ACCESO BLOQUEADO: No tienes EduCoins suficientes. Contacta a tu administrador al celular/WhatsApp ${numeroAdmin} para recargar saldo y continuar con tu misión.`);"
);

content = content.replace(
  /window\.showCustomAlert\("⚠️ ACCESO BLOQUEADO: No tienes EduCoins suficientes\. Contacta a tu administrador para recargar saldo y crear una nueva misión\."\);/g,
  "window.showCustomAlert(`⚠️ ACCESO BLOQUEADO: No tienes EduCoins suficientes. Contacta a tu administrador al celular/WhatsApp ${numeroAdmin} para recargar saldo y crear una nueva misión.`);"
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Updated useDashboardController.js alerts");

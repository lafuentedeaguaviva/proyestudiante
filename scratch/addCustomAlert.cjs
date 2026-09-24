const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'main.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const customAlertCode = `
// Alerta global personalizada con el estilo de la plataforma
window.showCustomAlert = (message, title = "Acceso Bloqueado") => {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999,
      opacity: 0, transition: 'opacity 0.3s ease'
    });

    const modal = document.createElement('div');
    Object.assign(modal.style, {
      background: 'rgba(15, 23, 42, 0.95)',
      padding: '2.5rem',
      borderRadius: '1.5rem',
      maxWidth: '450px',
      width: '90%',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
      borderTop: '4px solid #ef4444',
      transform: 'scale(0.9) translateY(20px)',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      textAlign: 'center',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif'
    });

    const icon = document.createElement('div');
    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>';
    icon.style.marginBottom = '1.5rem';

    const titleEl = document.createElement('h3');
    titleEl.innerText = title;
    Object.assign(titleEl.style, { margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: 'bold' });

    const msgEl = document.createElement('p');
    msgEl.innerText = message;
    Object.assign(msgEl.style, { color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '2rem' });

    const btn = document.createElement('button');
    btn.innerText = "Entendido";
    Object.assign(btn.style, {
      background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
      color: 'white', border: 'none', padding: '0.75rem 2rem',
      borderRadius: '0.75rem', fontSize: '1.1rem', fontWeight: 'bold',
      cursor: 'pointer', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
      transition: 'transform 0.2s'
    });

    modal.appendChild(icon);
    modal.appendChild(titleEl);
    modal.appendChild(msgEl);
    modal.appendChild(btn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Trigger animation
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      modal.style.transform = 'scale(1) translateY(0)';
    });

    const closeAlert = () => {
      overlay.style.opacity = '0';
      modal.style.transform = 'scale(0.9) translateY(20px)';
      setTimeout(() => {
        if(document.body.contains(overlay)) document.body.removeChild(overlay);
        resolve();
      }, 300);
    };

    btn.onclick = closeAlert;
  });
};
`;

if (!content.includes('window.showCustomAlert')) {
  content = content.replace("import './index.css'", "import './index.css'\n" + customAlertCode);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log("Global alert added to main.jsx");
} else {
  console.log("Already exists");
}

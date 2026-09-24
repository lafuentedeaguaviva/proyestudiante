const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/admin/UsersTab.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Añadir importación de recargarEducoins y de un icono como PlusCircle
content = content.replace(
  "import { Crown, ShieldCheck, ShieldOff } from 'lucide-react';",
  "import { Crown, ShieldCheck, ShieldOff, PlusCircle } from 'lucide-react';"
);

content = content.replace(
  "import { obtenerTodosLosUsuarios, cambiarRolUsuario } from '../../services/api';",
  "import { obtenerTodosLosUsuarios, cambiarRolUsuario, recargarEducoins } from '../../services/api';"
);

// 2. Añadir la cabecera EduCoins
content = content.replace(
  "<th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</th>",
  "<th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</th>\n                <th style={{ padding: '1.25rem 2rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>EduCoins</th>"
);

// 3. Modificar la función principal y añadir handleRecargar
const hookInsert = `
  const handleRecargar = async (targetUserId, currentName) => {
    const amountStr = window.prompt(\`¿Cuántos EduCoins deseas agregar a \${currentName}?\`, '50');
    if (!amountStr) return;
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ text: 'Cantidad inválida.', type: 'error' });
      return;
    }
    setCambiadoRolId(targetUserId); // Reutilizamos el estado de loading
    try {
      await recargarEducoins(targetUserId, amount);
      setMessage({ text: \`Se recargaron \${amount} EduCoins a \${currentName} exitosamente.\`, type: 'success' });
      await fetchUsuarios();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: 'Error al recargar EduCoins: ' + err.message, type: 'error' });
    } finally {
      setCambiadoRolId(null);
    }
  };
`;

content = content.replace(
  "const handleCambiarRol = async (targetUserId, nuevoRol) => {",
  hookInsert + "\n  const handleCambiarRol = async (targetUserId, nuevoRol) => {"
);

// 4. Añadir la celda de EduCoins y su botón
const tdEduCoins = `
                    <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#fcd34d', fontWeight: 'bold', fontSize: '1.1rem' }}>
                          🪙 {usr.educoins ?? 0}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRecargar(usr.id, usr.nombre_completo || 'Usuario')}
                          disabled={isChanging}
                          title="Recargar EduCoins"
                          style={{
                            background: 'rgba(245, 158, 11, 0.2)',
                            border: '1px solid rgba(245, 158, 11, 0.4)',
                            color: '#f59e0b',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isChanging ? 'not-allowed' : 'pointer',
                            opacity: isChanging ? 0.5 : 1
                          }}
                        >
                          <PlusCircle size={16} />
                        </motion.button>
                      </div>
                    </td>
`;

content = content.replace(
  "<td style={{ padding: '1rem 2rem', color: '#cbd5e1', fontSize: '0.95rem' }}>\n                      {usr.email}\n                    </td>",
  "<td style={{ padding: '1rem 2rem', color: '#cbd5e1', fontSize: '0.95rem' }}>\n                      {usr.email}\n                    </td>" + tdEduCoins
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('UsersTab updated successfully!');

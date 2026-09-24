const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/components/ui/SidebarFases.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Añadir importaciones
if (!content.includes("import { useAuth }")) {
  content = content.replace(
    "import { useNavigate, useLocation } from 'react-router-dom';",
    "import { useNavigate, useLocation } from 'react-router-dom';\nimport { useAuth } from '../../context/AuthContext';"
  );
}

if (!content.includes("User, Coins")) {
  content = content.replace(
    "Map, MapPin, CheckCircle, Lock, ChevronRight",
    "Map, MapPin, CheckCircle, Lock, ChevronRight, User, Coins"
  );
}

// 2. Extraer perfil de useAuth()
if (!content.includes("const { perfil } = useAuth();")) {
  content = content.replace(
    "const SidebarFases = () => {",
    "const SidebarFases = () => {\n  const { perfil } = useAuth();"
  );
}

// 3. Añadir el Footer con Educoins y Usuario
const footerCode = `
            {/* Widget de Usuario y EduCoins al final del Sidebar */}
            <div style={{
              padding: '1.25rem',
              borderTop: \`1px solid \${theme.border}\`,
              background: isMentor ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
              marginTop: 'auto'
            }}>
              <button
                onClick={() => {
                  navigate('/dashboard'); // Redirigir al dashboard
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  transition: 'background 0.2s',
                  marginBottom: '1rem'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = isMentor ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 'bold'
                }}>
                  <User size={20} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ color: theme.textMain, fontWeight: 'bold', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {perfil?.nombre_completo || 'Mi Perfil'}
                  </div>
                  <div style={{ color: theme.textSub, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {perfil?.email || 'Ver mi cuenta'}
                  </div>
                </div>
                <ChevronRight size={16} color={theme.textSub} />
              </button>

              {/* Barra de progreso EduCoins */}
              <div style={{ padding: '0 0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fcd34d', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    <Coins size={16} />
                    <span>EduCoins</span>
                  </div>
                  <span style={{ color: theme.textMain, fontWeight: 'bold', fontSize: '0.9rem' }}>{perfil?.educoins ?? 0}</span>
                </div>
                
                <div style={{ width: '100%', height: '8px', background: isMentor ? '#e2e8f0' : 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: \`\${Math.min(100, ((perfil?.educoins ?? 0) / 100) * 100)}%\` }}
                    transition={{ duration: 1, type: 'spring' }}
                    style={{ 
                      height: '100%', 
                      background: (perfil?.educoins ?? 0) > 20 ? '#fcd34d' : '#ef4444',
                      borderRadius: '4px'
                    }} 
                  />
                </div>
                <div style={{ textAlign: 'right', marginTop: '0.25rem', fontSize: '0.75rem', color: theme.textSub }}>
                  {(perfil?.educoins ?? 0) === 0 ? 'Sin monedas (IA Bloqueada)' : 'Quedan monedas'}
                </div>
              </div>
            </div>
`;

if (!content.includes("Widget de Usuario y EduCoins")) {
  const targetStr = "            </div>\r\n          </motion.div>";
  const targetStr2 = "            </div>\n          </motion.div>";
  
  if (content.includes(targetStr)) {
    content = content.replace(targetStr, footerCode + "\n          </motion.div>");
  } else if (content.includes(targetStr2)) {
    content = content.replace(targetStr2, footerCode + "\n          </motion.div>");
  } else {
    console.log("No encontré dónde insertarlo");
  }
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Finalizado update');

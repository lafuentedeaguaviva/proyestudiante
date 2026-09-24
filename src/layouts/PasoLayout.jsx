import React, { useEffect } from 'react';
import { Bot, ArrowLeft, ArrowRight, Save, Check } from 'lucide-react';
import SidebarFases from '../components/ui/SidebarFases';
import SubMenuFases from '../components/ui/SubMenuFases';
import StepperFases from '../components/ui/StepperFases';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PasoLayout = ({ 
  children, 
  faseTitle, 
  pasoActual, 
  totalPasos, 
  onSiguiente, 
  onAnterior,
  mentorText, 
  guardando,
  hideNavigation,
  tabs,
  onTabClick,
  customIcons
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { perfil } = useAuth();
  
  const isAdmin = perfil?.rol === 'admin';
  const isMentor = localStorage.getItem('temp_entorno_seleccionado') === '55555555-5555-5555-5555-555555555555' || window.location.pathname.toLowerCase().includes('mentor') || isAdmin;

  useEffect(() => {
    // Si no es mentor/admin y no tiene monedas, patear al dashboard
    if (!isMentor && (perfil?.educoins || 0) <= 0) {
      alert("⚠️ ACCESO BLOQUEADO: Tus EduCoins han llegado a cero. Por favor, adquiere más monedas para continuar.");
      navigate('/dashboard');
    }
  }, [perfil?.educoins, isMentor, navigate]);

  const [maxFaseDB, setMaxFaseDB] = React.useState(0);
  const [maxPasoFaseActual, setMaxPasoFaseActual] = React.useState(1);
  const isMentor = localStorage.getItem('temp_entorno_seleccionado') === '55555555-5555-5555-5555-555555555555' || window.location.pathname.toLowerCase().includes('mentor');

  React.useEffect(() => {
    const fetchMaxFase = async () => {
      const { supabase } = await import('../lib/supabaseClient');
      const proyecto_id = localStorage.getItem('temp_proyecto_id');
      if (proyecto_id) {
        const { data } = await supabase
          .from('proyecto_usuario')
          .select('fase_actual, paso_actual')
          .eq('id', proyecto_id)
          .single();
        if (data && data.fase_actual !== undefined) {
          setMaxFaseDB(data.fase_actual);
          setMaxPasoFaseActual(data.paso_actual || 1);
        }
      } else {
        setMaxFaseDB(isMentor ? 0 : 1);
      }
    };
    fetchMaxFase();
  }, [isMentor]);

  const match = location.pathname.match(/\/fase\/(\d+)/);
  const currentFaseId = match ? parseInt(match[1]) : null;

  const isStepUnlocked = (num) => {
    if (currentFaseId === null) return true; // Si no estamos en una ruta de fase específica
    if (currentFaseId < maxFaseDB) return true; // Fase pasada
    if (currentFaseId === maxFaseDB && num <= maxPasoFaseActual) return true; // Fase actual hasta paso alcanzado
    return false; // Paso futuro
  };

  const irAPasoDirecto = (num) => {
    if (!isStepUnlocked(num)) return;
    if (num === pasoActual) return;
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('paso', num);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <SidebarFases />
      
      <div style={{ flex: 1, padding: '2rem', height: '100vh', overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
          
          {/* Mentor Avatar Section */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(250, 204, 21, 0.4)', flexShrink: 0 }}>
              <Bot size={40} color="#854d0e" />
            </div>
            <div style={{ flex: 1, background: 'white', padding: '1.5rem', borderRadius: '1rem', borderTopLeftRadius: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, color: '#ca8a04', fontSize: '1.1rem', fontWeight: 700 }}>El Mentor</h3>
                {guardando && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#2563eb', fontWeight: 'bold' }}>
                    <Save size={14} /> Guardando...
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.6, color: '#334155' }}>{mentorText}</p>
            </div>
          </div>

          {/* Progress Indicator - Interactive Stepper */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ textAlign: 'center', color: '#0f172a', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              {faseTitle}
            </h2>
            
            {tabs && tabs.length > 0 ? (
              <SubMenuFases 
                tabs={tabs} 
                currentStep={pasoActual} 
                onTabClick={(id) => {
                  if (isStepUnlocked(id) || id <= pasoActual) {
                    if (onTabClick) onTabClick(id);
                    irAPasoDirecto(id);
                  }
                }}
              />
            ) : totalPasos > 1 && (
              <StepperFases 
                totalPasos={totalPasos} 
                pasoActual={pasoActual} 
                isStepUnlocked={isStepUnlocked} 
                onStepClick={irAPasoDirecto} 
                customIcons={customIcons}
              />
            )}
          </div>

          {/* Renderizador de Pasos (Main Content) */}
          <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            {children}
          </div>
          
          {/* Navegación Inferior */}
          {!hideNavigation && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
              <button 
                onClick={onAnterior}
                disabled={!onAnterior}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', 
                  background: onAnterior ? 'white' : '#f1f5f9', 
                  color: onAnterior ? '#334155' : '#cbd5e1', 
                  border: `2px solid ${onAnterior ? '#cbd5e1' : '#e2e8f0'}`, borderRadius: '1rem', 
                  cursor: onAnterior ? 'pointer' : 'not-allowed', fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { if(onAnterior) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; } }}
                onMouseLeave={(e) => { if(onAnterior) { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#cbd5e1'; } }}
              >
                <ArrowLeft size={20} /> Atrás
              </button>

              <button 
                onClick={onSiguiente}
                disabled={!onSiguiente || guardando}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', 
                  background: (!onSiguiente || guardando) ? '#e2e8f0' : '#3b82f6', 
                  color: (!onSiguiente || guardando) ? '#94a3b8' : 'white', 
                  border: 'none', borderRadius: '1rem', 
                  cursor: (!onSiguiente || guardando) ? 'not-allowed' : 'pointer', fontWeight: 'bold',
                  boxShadow: (!onSiguiente || guardando) ? 'none' : '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { if(onSiguiente && !guardando) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)'; } }}
                onMouseLeave={(e) => { if(onSiguiente && !guardando) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.39)'; } }}
              >
                {guardando ? (
                  <>Guardando... <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div></>
                ) : (
                  <>{pasoActual === totalPasos ? 'Finalizar Fase' : 'Siguiente'} <ArrowRight size={20} /></>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PasoLayout;

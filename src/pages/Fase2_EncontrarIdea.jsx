import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../components/ui/SplashScreen';
import DetectiveLayout from '../layouts/DetectiveLayout';
import SubMenuFases from '../components/ui/SubMenuFases';
import RetoValidacion from '../components/modos/mentor/retos/RetoValidacion';
import { useFase2Controller } from '../controllers/useFase2Controller';
import { Search, Eye, Lightbulb, Grid, Award, Code, Palette, Zap, Wrench, Calculator, Utensils, Map, Leaf, Scissors, Activity, MoreHorizontal, Video, PlayCircle, Plus, Trash2, FileText, Cpu, CheckCircle } from 'lucide-react';
import { NexusContext } from '../context/NexusContext';

const Fase2_EncontrarIdea = () => {
  const { 
    cargando, step, guardando, siguientePaso, pasoAnterior, errorStr, setErrorStr,
    showSplash, setShowSplash, retoDB, mostrarReto, setMostrarReto,
    mostrarVideoPista, setMostrarVideoPista, sugerenciasIA, setSugerenciasIA,
    cargandoIA, generarIdeasIA, handleMatrizChange, calcularTotal, ideaGanadoraIndex, handleFinalizar,
    area, otraArea, observaciones, ideas, matriz, tituloOficial, updateData
  , setPendingSave } = useFase2Controller();

  const setArea = (v) => updateData({ area: v });
  const setOtraArea = (v) => updateData({ otraArea: v });
  const setObservaciones = (v) => updateData({ observaciones: v });
  const setIdeas = (v) => updateData({ ideas: v });
  const setTituloOficial = (v) => updateData({ tituloOficial: v });

  const areasData = [
    { name: "Desarrollo de Software / Programación", icon: <Code size={32} strokeWidth={1.5} />, color: "#3b82f6" }, // blue
    { name: "Diseño Gráfico / Multimedia", icon: <Palette size={32} strokeWidth={1.5} />, color: "#d946ef" }, // fuchsia
    { name: "Electricidad / Electrónica", icon: <Zap size={32} strokeWidth={1.5} />, color: "#eab308" }, // yellow
    { name: "Mecánica Automotriz / Industrial", icon: <Wrench size={32} strokeWidth={1.5} />, color: "#f97316" }, // orange
    { name: "Contabilidad / Administración", icon: <Calculator size={32} strokeWidth={1.5} />, color: "#8b5cf6" }, // violet
    { name: "Gastronomía / Artes Culinarias", icon: <Utensils size={32} strokeWidth={1.5} />, color: "#ef4444" }, // red
    { name: "Turismo / Hotelería", icon: <Map size={32} strokeWidth={1.5} />, color: "#0ea5e9" }, // sky
    { name: "Agropecuaria / Veterinaria", icon: <Leaf size={32} strokeWidth={1.5} />, color: "#22c55e" }, // green
    { name: "Belleza / Cosmetología", icon: <Scissors size={32} strokeWidth={1.5} />, color: "#ec4899" }, // pink
    { name: "Salud / Enfermería", icon: <Activity size={32} strokeWidth={1.5} />, color: "#14b8a6" }, // teal
    { name: "Otra", icon: <MoreHorizontal size={32} strokeWidth={1.5} />, color: "#94a3b8" } // slate
  ];
  
  if (cargando) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  if (showSplash) {
    return (
      <SplashScreen 
        faseNumero="2"
        titulo="Las Primeras Pistas"
        descripcion="Todo gran caso comienza con un problema sin resolver. No busques soluciones todavía, busca el dolor."
        avatarSrc="/avatar_aster.png"
        onComenzar={() => setShowSplash(false)}
      />
    );
  }

  const getOrionDialog = () => {
    switch (step) {
      case 1: return "[SISTEMA INICIADO]... Hola. Soy ORION. El Director Aster dice que no confíe en ti, pero... ya veremos. Investiga el área.";
      case 2: return "Observa. ¿A quién le duele y por qué? Necesito perfiles, no suposiciones.";
      case 3: return "Analiza la fricción. La innovación nace exactamente donde las soluciones actuales fracasan.";
      case 4: return "Calculando... [Silencio] ... Genera múltiples soluciones. El Sesgo ataca a los que se conforman con la primera idea.";
      case 5: return "Los números son fríos y hermosos. No te enamores de tu idea, enamórate de la evidencia matemática.";
      case 6: return "Interesante. He seleccionado el vector óptimo. Bautiza tu expediente... y reza para no equivocarte.";
      default: return "";
    }
  };

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: 'rgba(15, 23, 42, 0.5)', color: '#0f172a', outline: 'none', marginBottom: '1.5rem' };
  const labelStyle = { display: 'block', color: '#60a5fa', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 };
  const sectionStyle = { background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem' };

  return (
    <DetectiveLayout canGoBack={true} personajeHablando={{ nombre: 'ORION (Sistema CRONOS)', rol: 'ayudante', avatarSrc: '/avatar_orion.png', dialogo: getOrionDialog() }}>
      <div style={{ width: '100%', margin: '0 auto', paddingBottom: '4rem' }}>
      <div onBlur={() => { if(typeof setPendingSave === 'function') setPendingSave(true); }}>
        
        {/* Progress Bar & Tabs */}
        <SubMenuFases 
          tabs={[
            { id: 1, icon: <Search size={18} />, label: 'Área' },
            { id: 2, icon: <Eye size={18} />, label: 'Observación' },
            { id: 3, icon: <FileText size={18} />, label: 'Análisis' },
            { id: 4, icon: <Lightbulb size={18} />, label: 'Lluvia' },
            { id: 5, icon: <Grid size={18} />, label: 'Matriz' },
            { id: 6, icon: <Award size={18} />, label: 'Elección' }
          ]}
          currentStep={step}
          onTabClick={setStep}
          color="#3b82f6"
        />

        {errorStr && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid rgba(239, 68, 68, 0.4)', textAlign: 'center' }}>
            {errorStr}
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* PASO 1: ÁREA */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>Selección de Área</h2>
              <p style={{ color: '#475569', marginBottom: '2rem' }}>Define tu campo de experiencia o interés principal.</p>

              <div style={sectionStyle}>
                <label style={labelStyle}>¿En qué carrera técnica o área quieres enfocar tu proyecto?</label>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                  {areasData.map(a => (
                    <motion.button
                      key={a.name}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={siguientePaso}} 
              style={{ padding: '0.75rem 2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Siguiente Paso
            </button>
          )}
        </div>

      </div>

      {/* GATEKEEPER */}
      <div className="animate-presence-removed">
        {mostrarReto && retoDB && (
          <RetoValidacion 
            retoInfo={retoDB}
            onSuperado={() => {
              setMostrarReto(false);
              navigate('/fase/3/intro');
            }}
            onFalladoCompleto={() => {
              setMostrarReto(false);
            }}
          />
        )}
      </div>
    </div>
    </DetectiveLayout>
  );
};

export default Fase2_EncontrarIdea;

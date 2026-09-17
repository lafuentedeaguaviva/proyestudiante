import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// Importar los pasos del Wizard
import Paso2_1_VideoRecurso from './pasos/Paso2_1_VideoRecurso';
import Paso2_2_PreguntasRecurso from './pasos/Paso2_2_PreguntasRecurso';
import Paso2_3_NecesidadesOcultas from './pasos/Paso2_3_NecesidadesOcultas';
import Paso4ExplicacionJTBD from './pasos/Paso4ExplicacionJTBD';
import Paso5CuadrosJTBD from './pasos/Paso5CuadrosJTBD';
import Paso5_5IdeandoSoluciones from './pasos/Paso5_5IdeandoSoluciones';
import Paso6AsistenteIA from './pasos/Paso6AsistenteIA';
import GeneradorEncuesta from './pasos/GeneradorEncuesta';
import AnalisisResultados from './pasos/AnalisisResultados';

export default function ObservacionEntorno({ setAyudanteText, areaSeleccionada, onComplete }) {
  // Máquina de estado del Wizard (1 al 9)
  // Paso 1 = Paso2_1_VideoRecurso
  // Paso 2 = Paso2_2_PreguntasRecurso
  // Paso 3 = Paso2_3_NecesidadesOcultas
  // Paso 4 = Paso4ExplicacionJTBD
  // Paso 5 = Paso5CuadrosJTBD
  // Paso 6 = Paso5_5IdeandoSoluciones
  // Paso 7 = Paso6AsistenteIA
  // Paso 8 = GeneradorEncuesta
  // Paso 9 = AnalisisResultados
  const [currentStep, setCurrentStep] = useState(1);

  // Estado global del flujo
  const [respuestasRecurso, setRespuestasRecurso] = useState('');
  const [cuadrosJTBD, setCuadrosJTBD] = useState([
    {
      id: Date.now(),
      frustracion: '',
      quienes: '',
      momento: '',
      alternativas: '',
      solucionUsuario: ''
    }
  ]);
  const [ideaSeleccionada, setIdeaSeleccionada] = useState(null);

  useEffect(() => {
    // Actualizar el texto del avatar según el paso actual
    switch (currentStep) {
      case 1:
        setAyudanteText(`Mira este video para aprender a observar como un verdadero emprendedor.`);
        break;
      case 2:
        setAyudanteText(`¡Excelente! Ahora cuéntame qué aprendiste de este recurso y cómo lo aplicarías.`);
        break;
      case 3:
        setAyudanteText(`A veces los problemas no son obvios. Aprendamos cómo detectar necesidades ocultas.`);
        break;
      case 4:
        setAyudanteText(`Conozcamos la metodología <b>Job to be Done</b> (Trabajo por hacer). ¡La gente no compra productos, compra soluciones a sus dolores!`);
        break;
      case 5:
        setAyudanteText(`Anota aquí lo que observaste estructurándolo con la metodología que acabamos de aprender.`);
        break;
      case 6:
        setAyudanteText(`¡Muy bien! Ahora, piensa cómo solucionarías cada una de estas frustraciones con un producto o servicio.`);
        break;
      case 7:
        setAyudanteText(`Déjame evaluar la coherencia de tus frustraciones y soluciones. ¡Selecciona la que creas que tiene más potencial comercial!`);
        break;
      case 8:
        setAyudanteText(`Aquí está tu encuesta lista para aplicar. Puedes copiarla, imprimirla o generar un enlace para enviarla por WhatsApp.`);
        break;
      case 9:
        setAyudanteText(`Una vez que recopilamos datos reales, la IA nos sugiere ideas de negocio exactas. ¡Revisemos los resultados!`);
        break;
      default:
        break;
    }
  }, [currentStep, setAyudanteText, areaSeleccionada]);

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleBack = () => setCurrentStep(prev => Math.max(1, prev - 1));
  const handleSkipSurvey = () => setCurrentStep(9); // Saltar directo a resultados
  const handleCompleteFlow = (sugerenciasFinales) => {
    // Aquí podrías enviar todo el estado recopilado a la app principal
    onComplete(sugerenciasFinales);
  };

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      
      {/* Botón Atrás (Regla de UX Global) */}
      {currentStep > 1 && (
        <button 
          onClick={handleBack}
          style={{ 
            position: 'absolute', 
            top: '-40px', 
            left: '0', 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-secondary)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: '1rem',
            zIndex: 10
          }}
        >
          <ArrowLeft size={20} /> Volver
        </button>
      )}

      {/* Indicador de Progreso */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '2rem', justifyContent: 'center' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(step => (
          <div 
            key={step} 
            style={{ 
              height: '6px', 
              width: '40px', 
              background: step <= currentStep ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
              borderRadius: '3px',
              transition: 'background 0.3s ease'
            }} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <Paso2_1_VideoRecurso key="step1" onNext={handleNext} />
        )}
        {currentStep === 2 && (
          <Paso2_2_PreguntasRecurso key="step2" respuestasRecurso={respuestasRecurso} setRespuestasRecurso={setRespuestasRecurso} onNext={handleNext} />
        )}
        {currentStep === 3 && (
          <Paso2_3_NecesidadesOcultas key="step3" onNext={handleNext} />
        )}
        {currentStep === 4 && (
          <Paso4ExplicacionJTBD key="step4" onNext={handleNext} />
        )}
        {currentStep === 5 && (
          <Paso5CuadrosJTBD key="step5" cuadros={cuadrosJTBD} setCuadros={setCuadrosJTBD} onNext={handleNext} />
        )}
        {currentStep === 6 && (
          <Paso5_5IdeandoSoluciones key="step6" cuadros={cuadrosJTBD} setCuadros={setCuadrosJTBD} onNext={handleNext} />
        )}
        {currentStep === 7 && (
          <Paso6AsistenteIA key="step7" cuadros={cuadrosJTBD} ideaSeleccionada={ideaSeleccionada} setIdeaSeleccionada={setIdeaSeleccionada} onNext={handleNext} />
        )}
        {currentStep === 8 && (
          <GeneradorEncuesta key="step8" ideaSeleccionada={ideaSeleccionada} onNext={handleNext} onSkip={handleSkipSurvey} />
        )}
        {currentStep === 9 && (
          <AnalisisResultados key="step9" ideaSeleccionada={ideaSeleccionada} onComplete={handleCompleteFlow} />
        )}
      </AnimatePresence>

    </div>
  );
}

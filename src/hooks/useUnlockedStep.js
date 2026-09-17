import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLocation } from 'react-router-dom';

export function useUnlockedStep(localStep) {
  const location = useLocation();
  const [maxFaseDB, setMaxFaseDB] = useState(0);
  const [maxPasoFaseActual, setMaxPasoFaseActual] = useState(1);
  const [sessionMaxStep, setSessionMaxStep] = useState(localStep || 1);

  useEffect(() => {
    if (localStep > sessionMaxStep) {
      setSessionMaxStep(localStep);
    }
  }, [localStep, sessionMaxStep]);

  useEffect(() => {
    const isMentor = localStorage.getItem('temp_entorno_seleccionado') === '55555555-5555-5555-5555-555555555555' || window.location.pathname.toLowerCase().includes('mentor');
    const fetchMaxFase = async () => {
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
  }, []);

  const match = location.pathname.match(/\/fase\/(\d+)/);
  const currentFaseId = match ? parseInt(match[1]) : null;

  if (currentFaseId === null) return 999;
  if (currentFaseId < maxFaseDB) return 999;
  return Math.max(sessionMaxStep, maxPasoFaseActual);
}

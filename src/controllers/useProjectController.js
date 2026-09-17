import { useContext, useCallback } from 'react';
import { GlobalContext } from '../context/GlobalStateModel';
import { useNavigate } from 'react-router-dom';

export const useProjectController = () => {
  const { state, actions } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleStartFase = useCallback((faseId) => {
    if (!state.activeProject) {
      console.warn('No active project to start phase');
      return;
    }
    // Verificar si la fase está desbloqueada
    if (faseId > state.maxFaseUnlocked && faseId !== 0) {
      alert("Fase bloqueada. Completa las fases anteriores primero.");
      return;
    }
    navigate(`/fase/${faseId}`);
  }, [state, navigate]);

  const handleCompleteFase = useCallback((faseId) => {
    actions.setMaxFase(faseId + 1);
    actions.updateProjectData({
      [`fase_${faseId}_completada`]: true
    });
    // Volver al dashboard
    navigate('/dashboard');
  }, [actions, navigate]);

  return {
    state,
    actions,
    handleStartFase,
    handleCompleteFase
  };
};

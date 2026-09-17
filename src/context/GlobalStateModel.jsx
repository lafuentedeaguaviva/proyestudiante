import React, { createContext, useReducer, useEffect } from 'react';

// Estado inicial
const initialState = {
  userProfile: null,
  activeProject: null,
  maxFaseUnlocked: 0,
};

// Acciones
const ACTIONS = {
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  SET_ACTIVE_PROJECT: 'SET_ACTIVE_PROJECT',
  UPDATE_PROJECT_DATA: 'UPDATE_PROJECT_DATA',
  SET_MAX_FASE: 'SET_MAX_FASE',
  LOGOUT: 'LOGOUT',
};

// Reducer
const globalReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER_PROFILE:
      return { ...state, userProfile: action.payload };
    case ACTIONS.SET_ACTIVE_PROJECT:
      return { ...state, activeProject: action.payload };
    case ACTIONS.UPDATE_PROJECT_DATA:
      if (!state.activeProject) return state;
      return { 
        ...state, 
        activeProject: { ...state.activeProject, data: { ...state.activeProject.data, ...action.payload } }
      };
    case ACTIONS.SET_MAX_FASE:
      return { ...state, maxFaseUnlocked: Math.max(state.maxFaseUnlocked, action.payload) };
    case ACTIONS.LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export const GlobalContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState, (initial) => {
    const saved = localStorage.getItem('gamified_global_state');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('gamified_global_state', JSON.stringify(state));
  }, [state]);

  const actions = {
    setUserProfile: (profile) => dispatch({ type: ACTIONS.SET_USER_PROFILE, payload: profile }),
    setActiveProject: (project) => dispatch({ type: ACTIONS.SET_ACTIVE_PROJECT, payload: project }),
    updateProjectData: (data) => dispatch({ type: ACTIONS.UPDATE_PROJECT_DATA, payload: data }),
    setMaxFase: (fase) => dispatch({ type: ACTIONS.SET_MAX_FASE, payload: fase }),
    logout: () => {
      localStorage.removeItem('gamified_global_state');
      dispatch({ type: ACTIONS.LOGOUT });
    }
  };

  return (
    <GlobalContext.Provider value={{ state, actions }}>
      {children}
    </GlobalContext.Provider>
  );
};

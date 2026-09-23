import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CompletarPerfil from './pages/CompletarPerfil';
import Dashboard from './pages/Dashboard';
import Fase0_OnboardingMentor from './pages/Fase0_OnboardingMentor';
import Fase1_Onboarding from './pages/Fase1_Onboarding';
import Fase1_EmprendimientoMentor from './pages/Fase1_EmprendimientoMentor';
import Fase2_ValidacionIdea from './pages/Fase2_ValidacionIdea';
import Fase3_Onboarding from './pages/Fase3_Onboarding';
import Fase3_PublicoObjetivo from './pages/Fase3_PublicoObjetivo';
import Fase4_DisenoProducto from './pages/Fase4_DisenoProducto';
import Fase5_Onboarding from './pages/Fase5_Onboarding';
import Fase5_EstrategiaMarketing from './pages/Fase5_EstrategiaMarketing';
import Fase6_LocalizacionDistribucion from './pages/Fase6_LocalizacionDistribucion';
import Fase7_Planteamiento from './pages/Fase7_Planteamiento';
import Fase8_Operacion from './pages/Fase8_Operacion';
import Fase9_Estructura from './pages/Fase9_Estructura';
import Fase10_PlanFinanciero from './pages/Fase10_PlanFinanciero';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import Fase11_DocumentoFinal from './pages/Fase11_DocumentoFinal';
import Fase12_ProyectoVida from './pages/Fase12_ProyectoVida';
import Fase13_DocumentoIA from './pages/Fase13_DocumentoIA';
import GameOverNexus from './pages/GameOverNexus';
import LoginScreen from './pages/LoginScreen';
import EncuestaPublica from './pages/EncuestaPublica';
import AdminDashboard from './pages/AdminDashboard';
import FaseIntro from './pages/FaseIntro';
import { NexusProvider } from './context/NexusContext';
import { GlobalStateProvider } from './context/GlobalStateModel';
import { AuthProvider } from './context/AuthContext';
import ProtectedAdminRoute from './components/ui/ProtectedAdminRoute';

const AppRouter = () => {
  return (
    <AuthProvider>
      <GlobalStateProvider>
        <NexusProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/completar-perfil" element={<CompletarPerfil />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/fase/0" element={<Fase0_OnboardingMentor />} />
              <Route path="/fase/:faseId/intro" element={<FaseIntro />} />
              <Route path="/fase/1" element={<Fase1_EmprendimientoMentor />} />
              <Route path="/fase/2" element={<Fase2_ValidacionIdea />} />
              <Route path="/fase/3" element={<Fase3_PublicoObjetivo />} />
              <Route path="/fase/4" element={<Fase4_DisenoProducto />} />
              <Route path="/fase/5" element={<Fase5_EstrategiaMarketing />} />
              <Route path="/fase/6" element={<Fase6_LocalizacionDistribucion />} />
              <Route path="/fase/7" element={<Fase7_Planteamiento />} />
              <Route path="/fase/8" element={<Fase8_Operacion />} />
              <Route path="/fase/9" element={<ErrorBoundary><Fase9_Estructura /></ErrorBoundary>} />
              <Route path="/fase/10" element={<ErrorBoundary><Fase10_PlanFinanciero /></ErrorBoundary>} />
              <Route path="/fase/11" element={<ErrorBoundary><Fase11_DocumentoFinal /></ErrorBoundary>} />
              <Route path="/fase/12" element={<ErrorBoundary><Fase12_ProyectoVida /></ErrorBoundary>} />
              <Route path="/fase/13" element={<ErrorBoundary><Fase13_DocumentoIA /></ErrorBoundary>} />
              <Route path="/gameover" element={<GameOverNexus />} />
              <Route path="/encuesta/:projectId" element={<EncuestaPublica />} />
              <Route path="/admin/prompts" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
            </Routes>
          </BrowserRouter>
        </NexusProvider>
      </GlobalStateProvider>
    </AuthProvider>
  );
};

export default AppRouter;

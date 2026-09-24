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
import ProtectedRoute from './components/ui/ProtectedRoute';

const AppRouter = () => {
  return (
    <AuthProvider>
      <GlobalStateProvider>
        <NexusProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/completar-perfil" element={<ProtectedRoute requireProfile={false}><CompletarPerfil /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/fase/0" element={<ProtectedRoute><Fase0_OnboardingMentor /></ProtectedRoute>} />
              <Route path="/fase/:faseId/intro" element={<ProtectedRoute><FaseIntro /></ProtectedRoute>} />
              <Route path="/fase/1" element={<ProtectedRoute><Fase1_EmprendimientoMentor /></ProtectedRoute>} />
              <Route path="/fase/2" element={<ProtectedRoute><Fase2_ValidacionIdea /></ProtectedRoute>} />
              <Route path="/fase/3" element={<ProtectedRoute><Fase3_PublicoObjetivo /></ProtectedRoute>} />
              <Route path="/fase/4" element={<ProtectedRoute><Fase4_DisenoProducto /></ProtectedRoute>} />
              <Route path="/fase/5" element={<ProtectedRoute><Fase5_EstrategiaMarketing /></ProtectedRoute>} />
              <Route path="/fase/6" element={<ProtectedRoute><Fase6_LocalizacionDistribucion /></ProtectedRoute>} />
              <Route path="/fase/7" element={<ProtectedRoute><Fase7_Planteamiento /></ProtectedRoute>} />
              <Route path="/fase/8" element={<ProtectedRoute><Fase8_Operacion /></ProtectedRoute>} />
              <Route path="/fase/9" element={<ProtectedRoute><ErrorBoundary><Fase9_Estructura /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/fase/10" element={<ProtectedRoute><ErrorBoundary><Fase10_PlanFinanciero /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/fase/11" element={<ProtectedRoute><ErrorBoundary><Fase11_DocumentoFinal /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/fase/12" element={<ProtectedRoute><ErrorBoundary><Fase12_ProyectoVida /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/fase/13" element={<ProtectedRoute><ErrorBoundary><Fase13_DocumentoIA /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/gameover" element={<ProtectedRoute><GameOverNexus /></ProtectedRoute>} />
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

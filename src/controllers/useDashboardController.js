import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProyectoModel } from '../models/ProyectoModel';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export const useDashboardController = () => {
  const navigate = useNavigate();
  const { isAdmin, perfil } = useAuth();
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMundos, setShowMundos] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  
  // QR Payment Flow
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [numeroAdmin, setNumeroAdmin] = useState("71541014");
  const [selectedMundoId, setSelectedMundoId] = useState(null);
  const [versiculoRandom, setVersiculoRandom] = useState(null);

  const fetchProyectos = useCallback(async () => {
    try {
      setLoading(true);
      const misProyectos = await ProyectoModel.getMisProyectos();
      setProyectos(misProyectos);
      if (misProyectos.length === 0) setShowMundos(true);
      
      // Fetch Config (QR y Número)
      const { data: configs } = await supabase
        .from('configuracion_prompts_ia')
        .select('proposito, prompt_texto')
        .eq('fase_id', 0)
        .in('proposito', ['qr_pago_url', 'numero_contacto_admin']);
        
      if (configs) {
        const qrConf = configs.find(c => c.proposito === 'qr_pago_url');
        const numConf = configs.find(c => c.proposito === 'numero_contacto_admin');
        if (qrConf) setQrUrl(qrConf.prompt_texto);
        if (numConf) setNumeroAdmin(numConf.prompt_texto);
      }

      // Fetch Versículos
      const { data: versesData, error: versesError } = await supabase
        .from('prompts_ia')
        .select('prompt_texto')
        .eq('fase_id', 0)
        .eq('proposito', 'versiculos_biblicos')
        .single();
        
      let versesArray = [
        { texto: "Todo lo puedo en Cristo que me fortalece.", cita: "Filipenses 4:13" },
        { texto: "Porque yo sé muy bien los planes que tengo para ustedes...", cita: "Jeremías 29:11" }
      ];

      if (!versesError && versesData && versesData.prompt_texto) {
        try {
          const parsed = JSON.parse(versesData.prompt_texto);
          if (parsed && parsed.length > 0) {
            versesArray = parsed;
          }
        } catch(e) {
          console.warn("Error parsing verses", e);
        }
      }
      
      const randomVerse = versesArray[Math.floor(Math.random() * versesArray.length)];
      setVersiculoRandom(randomVerse);

    } catch (err) {
      console.error(err);
      window.showCustomAlert("Error al cargar los proyectos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProyectos();
  }, [fetchProyectos]);

  const handleCrearProyecto = (mundoId) => {
    if (!isAdmin && (perfil?.educoins || 0) <= 0) {
      window.showCustomAlert(`⚠️ ACCESO BLOQUEADO: No tienes EduCoins suficientes. Contacta a tu administrador al celular/WhatsApp ${numeroAdmin} para recargar saldo y crear una misión.`);
      return;
    }
    // Saltamos el modal QR temporalmente
    localStorage.setItem('temp_entorno_seleccionado', mundoId);
    if (mundoId === '55555555-5555-5555-5555-555555555555') {
      navigate('/fase/0');
    } else {
      navigate('/fase/1');
    }
  };

  const handleConfirmarPago = () => {
    setIsQrModalOpen(false);
    if (!selectedMundoId) return;
    
    localStorage.setItem('temp_entorno_seleccionado', selectedMundoId);
    if (selectedMundoId === '55555555-5555-5555-5555-555555555555') {
      navigate('/fase/0');
    } else {
      navigate('/fase/1');
    }
  };

    const handleRetomarProyecto = (proyecto) => {
    // Verificar EduCoins antes de ingresar (si no es admin)
    if (!isAdmin && (perfil?.educoins || 0) <= 0) {
      window.showCustomAlert(`⚠️ ACCESO BLOQUEADO: No tienes EduCoins suficientes. Contacta a tu administrador al celular/WhatsApp ${numeroAdmin} para recargar saldo y continuar con tu misión.`);
      return;
    }
    localStorage.setItem('temp_proyecto_id', proyecto.id);
    navigate(`/fase/${proyecto.fase_actual}`);
  };

  const handleEliminarProyecto = async (e, id) => {
    e.stopPropagation(); // Early return pattern to avoid bubbling
    if (!window.confirm("¿Seguro que deseas eliminar esta misión por completo? No hay vuelta atrás.")) {
      return;
    }
    
    try {
      await ProyectoModel.deleteProyecto(id);
      setProyectos((prev) => prev.filter(p => p.id !== id));
      if (proyectos.length === 1) setShowMundos(true);
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  const iniciarEdicion = (e, proyecto) => {
    e.stopPropagation();
    setEditingId(proyecto.id);
    setEditTitle(proyecto.titulo || 'Expediente Clasificado');
  };

  const cancelarEdicion = (e) => {
    if(e) e.stopPropagation();
    setEditingId(null);
    setEditTitle('');
  };

  const guardarEdicion = async (e, id) => {
    e.stopPropagation();
    if (!editTitle.trim()) {
      cancelarEdicion();
      return;
    }

    try {
      await ProyectoModel.updateTitulo(id, editTitle);
      setProyectos((prev) => prev.map(p => p.id === id ? { ...p, titulo: editTitle } : p));
      setEditingId(null);
    } catch (err) {
      alert("Error al actualizar título: " + err.message);
    }
  };

  const toggleShowMundos = (val) => {
    if (val === true && !isAdmin && (perfil?.educoins || 0) <= 0) {
      window.showCustomAlert(`⚠️ ACCESO BLOQUEADO: No tienes EduCoins suficientes. Contacta a tu administrador al celular/WhatsApp ${numeroAdmin} para recargar saldo y crear una nueva misión.`);
      return;
    }
    setShowMundos(val);
  };

  return {
    state: {
      proyectos,
      loading,
      showMundos,
      editingId,
      editTitle,
      isQrModalOpen,
      qrUrl,
      versiculoRandom,
      numeroAdmin
    },
    actions: {
      handleCrearProyecto,
      handleConfirmarPago,
      closeQrModal: () => setIsQrModalOpen(false),
      handleRetomarProyecto,
      handleEliminarProyecto,
      iniciarEdicion,
      cancelarEdicion,
      guardarEdicion,
      setEditTitle,
      toggleShowMundos,
      goToAdmin: () => navigate('/admin/prompts'),
      goToProfile: () => navigate('/completar-perfil')
    }
  };
};

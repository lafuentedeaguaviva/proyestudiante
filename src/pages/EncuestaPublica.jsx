import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const RadioGroup = ({ options, value, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
    {options.map(opt => {
      const isSelected = value === opt.value;
      return (
        <div
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`cursor-pointer p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between
            ${isSelected 
              ? 'border-[#38BDF8] bg-[#38BDF8]/10' 
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700'
            }`}
        >
          <span className={`font-medium text-sm sm:text-base ${isSelected ? 'text-[#38BDF8]' : 'text-slate-300'}`}>{opt.label}</span>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2
            ${isSelected ? 'border-[#38BDF8]' : 'border-slate-600'}
          `}>
            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />}
          </div>
        </div>
      );
    })}
  </div>
);

const CheckboxGroup = ({ options, values, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
    {options.map(opt => {
      const isSelected = values.includes(opt);
      return (
        <div
          key={opt}
          onClick={() => onChange(opt)}
          className={`cursor-pointer p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between
            ${isSelected 
              ? 'border-[#38BDF8] bg-[#38BDF8]/10' 
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700'
            }`}
        >
          <span className={`font-medium text-sm sm:text-base ${isSelected ? 'text-[#38BDF8]' : 'text-slate-300'}`}>{opt}</span>
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ml-2
            ${isSelected ? 'border-[#38BDF8] bg-[#38BDF8]' : 'border-slate-600'}
          `}>
            {isSelected && <svg className="w-3.5 h-3.5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          </div>
        </div>
      );
    })}
  </div>
);

const EncuestaPublica = () => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [enviado, setEnviado] = useState(false);
  const [seccionActual, setSeccionActual] = useState(1);
  const [proyectoInfo, setProyectoInfo] = useState({
    titulo: 'este emprendimiento',
    problema: 'el problema que tu proyecto resuelve',
    beneficio: 'un beneficio clave que te interese'
  });

  const [datos, setDatos] = useState({
    edad: '', genero: '', ubicacion: '', estudios: '',
    recibeDinero: '', dineroSemana: '', gastos: [],
    frecuenciaActividad: '', factorImportante: '', dondeAdquiere: '', redes: [],
    dificultadProblema: '', intentoResolver: '', queHaceActualmente: '',
    usariaSolucion: '', frecuenciaCompra: '', unidadesPorVez: '', momentoUso: [], cuantoPagaria: '', caracteristicaImportante: '', mejora: '',
    quiereInfo: '', contacto: ''
  });

  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        if (!projectId) return;

        // Extraer título básico
        const { data: pData, error: pError } = await supabase
          .from('proyecto_usuario')
          .select('nombre_proyecto')
          .eq('id', projectId)
          .single();

        let newInfo = { ...proyectoInfo };
        if (!pError && pData) {
          newInfo.titulo = pData.nombre_proyecto || newInfo.titulo;
        }

        // Extraer dolores/soluciones si existen
        const { data: cData, error: cError } = await supabase
          .from('contenido_proyecto')
          .select('campo_clave, contenido')
          .eq('proyecto_id', projectId);

        if (!cError && cData) {
          const prob = cData.find(c => c.campo_clave === 'frase_problema' || c.campo_clave === 'dolor');
          const sol = cData.find(c => c.campo_clave === 'solucionIdeal' || c.campo_clave === 'idea_ganadora' || c.campo_clave === 'nombre_proyecto');
          
          if (prob && prob.contenido) newInfo.problema = prob.contenido;
          if (sol && sol.contenido) newInfo.beneficio = sol.contenido;
        }

        setProyectoInfo(newInfo);
      } catch (err) {
        console.error("Error fetching project data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProyecto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleChange = (campo, valor) => {
    setDatos(prev => ({ ...prev, [campo]: valor }));
  };

  const handleCheckboxArray = (campo, valor) => {
    setDatos(prev => {
      const arr = prev[campo];
      if (arr.includes(valor)) {
        return { ...prev, [campo]: arr.filter(v => v !== valor) };
      } else {
        return { ...prev, [campo]: [...arr, valor] };
      }
    });
  };

  const nextSection = () => {
    // Basic validation before next
    setSeccionActual(prev => Math.min(prev + 1, 6));
  };
  
  const prevSection = () => setSeccionActual(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevaRespuesta = {
        id: Date.now(),
        edad: datos.edad,
        genero: datos.genero,
        zona: datos.ubicacion,
        est: datos.estudios,
        ing: datos.recibeDinero,
        cant: datos.dineroSemana,
        gasto: datos.gastos.join(', '),
        frec: datos.frecuenciaActividad,
        import: datos.factorImportante,
        lugar: datos.dondeAdquiere,
        redes: datos.redes.join(', '),
        dif: datos.dificultadProblema,
        intent: datos.intentoResolver,
        act: datos.queHaceActualmente,
        uso: datos.usariaSolucion,
        frecCompra: datos.frecuenciaCompra,
        unidades: datos.unidadesPorVez,
        momento: datos.momentoUso.join(', '),
        pago: datos.cuantoPagaria,
        carac: datos.caracteristicaImportante,
        mejora: datos.mejora,
        info: datos.quiereInfo,
        cont: datos.contacto,
        fuente: 'online'
      };

      // Obtener el contenido actual para no sobreescribir otras respuestas
      const { data: existingData, error: fetchError } = await supabase
        .from('contenido_proyecto')
        .select('id, contenido')
        .eq('proyecto_id', projectId)
        .eq('fase', 2)
        .eq('campo_clave', 'validacion_idea')
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingData) {
        let currentEncuestas = [];
        if (existingData.contenido && existingData.contenido.encuestas) {
          currentEncuestas = existingData.contenido.encuestas;
        }
        currentEncuestas.push(nuevaRespuesta);

        const { error: updateError } = await supabase
          .from('contenido_proyecto')
          .update({ contenido: { ...existingData.contenido, encuestas: currentEncuestas } })
          .eq('id', existingData.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('contenido_proyecto')
          .insert([{
            proyecto_id: projectId,
            fase: 2,
            campo_clave: 'validacion_idea',
            contenido: { encuestas: [nuevaRespuesta] }
          }]);
        
        if (insertError) throw insertError;
      }

      setEnviado(true);
    } catch (err) {
      console.error("Error al guardar la encuesta:", err);
      alert("Hubo un error al enviar tu respuesta. Por favor intenta de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="theme-detective flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-[#38BDF8]" size={48} />
      </div>
    );
  }

  if (enviado) {
    return (
      <div className="theme-detective flex items-center justify-center min-h-screen p-4">
        <div className="card-detective text-center max-w-lg w-full">
          <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="title-detective" style={{fontSize: '2rem'}}>¡Gracias por tu participación!</h2>
          <p className="text-slate-400">Tus respuestas han sido enviadas anónimamente y ayudarán mucho al desarrollo de <strong className="text-white">{proyectoInfo.titulo}</strong>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-detective min-h-screen py-10 px-4">
      <div className="card-detective max-w-2xl mx-auto" style={{animation: 'fadeIn 0.5s ease'}}>
        <h1 className="title-detective text-center text-3xl mb-2">ENCUESTA DE VALIDACIÓN</h1>
        <p className="text-slate-400 text-center mb-6">Proyecto: <span className="text-[#38BDF8] font-bold">{proyectoInfo.titulo}</span></p>

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8">
          {[1,2,3,4,5,6].map(step => (
            <div key={step} className={`h-2 flex-1 mx-1 rounded-full transition-colors duration-300 ${step <= seccionActual ? 'bg-[#38BDF8]' : 'bg-slate-700'}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {seccionActual === 1 && (
            <div style={{animation: 'fadeIn 0.3s ease'}}>
              <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Sección 1: Datos Personales</h2>
              
              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">1. ¿Cuál es tu edad?</label>
                <RadioGroup 
                  value={datos.edad} 
                  onChange={v => handleChange('edad', v)}
                  options={[
                    {value: '10-13', label: '10-13 años'},
                    {value: '14-17', label: '14-17 años'},
                    {value: '18-21', label: '18-21 años'},
                    {value: '22-30', label: '22-30 años'},
                    {value: '31-45', label: '31-45 años'},
                    {value: '45-65', label: '45-65 años'},
                    {value: '>65', label: 'Más de 65 años'}
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">2. ¿Cuál es tu género?</label>
                <RadioGroup 
                  value={datos.genero} 
                  onChange={v => handleChange('genero', v)}
                  options={[
                    {value: 'Masculino', label: 'Masculino'},
                    {value: 'Femenino', label: 'Femenino'}
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">3. ¿Dónde vives o estudias?</label>
                <RadioGroup 
                  value={datos.ubicacion} 
                  onChange={v => handleChange('ubicacion', v)}
                  options={[
                    {value: 'Zona norte', label: 'Zona norte'},
                    {value: 'Zona sur', label: 'Zona sur'},
                    {value: 'Zona este', label: 'Zona este'},
                    {value: 'Zona oeste', label: 'Zona oeste'},
                    {value: 'Centro', label: 'Centro'},
                    {value: 'Otro', label: 'Otro lugar'}
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">4. ¿Cuál es tu nivel de estudios actual?</label>
                <RadioGroup 
                  value={datos.estudios} 
                  onChange={v => handleChange('estudios', v)}
                  options={[
                    {value: 'Primaria', label: 'Primaria'},
                    {value: 'Secundaria', label: 'Secundaria (cursando)'},
                    {value: 'Bachillerato', label: 'Bachillerato'},
                    {value: 'Tecnico', label: 'Técnico Superior'},
                    {value: 'Licenciatura', label: 'Licenciatura'},
                    {value: 'Posgrado', label: 'Posgrado'},
                    {value: 'Otro', label: 'Otro'}
                  ]} 
                />
              </div>
            </div>
          )}

          {seccionActual === 2 && (
            <div style={{animation: 'fadeIn 0.3s ease'}}>
              <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Sección 2: Situación Económica</h2>
              
              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">5. ¿Recibes dinero para tus gastos personales?</label>
                <RadioGroup 
                  value={datos.recibeDinero} 
                  onChange={v => handleChange('recibeDinero', v)}
                  options={[
                    {value: 'Mesada semanal', label: 'Sí, mesada semanal'},
                    {value: 'Mesada mensual', label: 'Sí, mesada mensual'},
                    {value: 'Trabajo medio tiempo', label: 'Sí, trabajo medio tiempo'},
                    {value: 'Trabajo tiempo completo', label: 'Sí, trabajo tiempo completo'},
                    {value: 'No recibo', label: 'No recibo dinero'}
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">6. Aproximadamente, ¿cuánto dinero tienes disponible para gastar por semana?</label>
                <RadioGroup 
                  value={datos.dineroSemana} 
                  onChange={v => handleChange('dineroSemana', v)}
                  options={[
                    {value: '<50', label: 'Menos de Bs. 50'},
                    {value: '50-150', label: 'Bs. 50 - 150'},
                    {value: '151-300', label: 'Bs. 151 - 300'},
                    {value: '301-500', label: 'Bs. 301 - 500'},
                    {value: '>500', label: 'Más de Bs. 500'}
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">7. ¿En qué sueles gastar tu dinero principalmente? (Puedes marcar más de una)</label>
                <CheckboxGroup 
                  values={datos.gastos} 
                  onChange={v => handleCheckboxArray('gastos', v)}
                  options={[
                    'Comida / Alimentos', 'Transporte', 'Ropa / Calzado', 
                    'Entretenimiento (cine, juegos)', 'Tecnología (celular, internet)', 'Ahorro', 'Otro'
                  ]} 
                />
              </div>
            </div>
          )}

          {seccionActual === 3 && (
            <div style={{animation: 'fadeIn 0.3s ease'}}>
              <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Sección 3: Hábitos y Comportamiento</h2>
              
              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">8. ¿Con qué frecuencia realizas actividades relacionadas con: <span className="text-[#38BDF8] italic">"{proyectoInfo.problema}"</span>?</label>
                <RadioGroup 
                  value={datos.frecuenciaActividad} 
                  onChange={v => handleChange('frecuenciaActividad', v)}
                  options={[
                    {value: 'Todos los días', label: 'Todos los días'},
                    {value: '2-3 veces por semana', label: '2-3 veces por semana'},
                    {value: '1 vez por semana', label: '1 vez por semana'},
                    {value: '1 vez al mes', label: '1 vez al mes'},
                    {value: 'Rara vez', label: 'Rara vez'},
                    {value: 'Nunca', label: 'Nunca'}
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">9. ¿Qué es lo más importante para ti al momento de elegir un producto/servicio similar?</label>
                <RadioGroup 
                  value={datos.factorImportante} 
                  onChange={v => handleChange('factorImportante', v)}
                  options={[
                    {value: 'Precio bajo', label: 'Precio bajo'},
                    {value: 'Buena calidad', label: 'Buena calidad'},
                    {value: 'Saludable / Ecológico', label: 'Saludable / Ecológico'},
                    {value: 'Rapidez', label: 'Rápido y fácil de conseguir'},
                    {value: 'Moda', label: 'De moda o tendencia'},
                    {value: 'Atención al cliente', label: 'Excelente atención al cliente'}
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">10. ¿Dónde sueles buscar o adquirir este tipo de producto/servicio?</label>
                <RadioGroup 
                  value={datos.dondeAdquiere} 
                  onChange={v => handleChange('dondeAdquiere', v)}
                  options={[
                    {value: 'Colegio/Trabajo', label: 'Colegio / universidad / trabajo'},
                    {value: 'Tiendas cercanas', label: 'Tiendas de barrio cercanas'},
                    {value: 'Supermercados', label: 'Supermercados / centros'},
                    {value: 'Internet', label: 'En línea (internet, redes)'},
                    {value: 'Yo mismo', label: 'Lo preparo yo mismo'},
                    {value: 'Otro', label: 'Otro'}
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">11. ¿Qué redes sociales usas con más frecuencia?</label>
                <CheckboxGroup 
                  values={datos.redes} 
                  onChange={v => handleCheckboxArray('redes', v)}
                  options={['Instagram', 'TikTok', 'WhatsApp', 'Facebook', 'YouTube', 'X (Twitter)', 'Otra']} 
                />
              </div>
            </div>
          )}

          {seccionActual === 4 && (
            <div style={{animation: 'fadeIn 0.3s ease'}}>
              <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Sección 4: Validación del Problema</h2>
              
              <div className="mb-6 bg-slate-800 p-4 rounded-xl border-l-4 border-[#38BDF8]">
                <p className="text-sm text-[#38BDF8] font-bold mb-1">Contexto del problema:</p>
                <p className="text-white italic">"{proyectoInfo.problema}"</p>
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">12. En una escala del 1 al 5, ¿qué tan difícil o frustrante te resulta lidiar con esto?</label>
                <RadioGroup 
                  value={datos.dificultadProblema} 
                  onChange={v => handleChange('dificultadProblema', v)}
                  options={[
                    {value: '1', label: '1 (Nada difícil)'},
                    {value: '2', label: '2'},
                    {value: '3', label: '3'},
                    {value: '4', label: '4'},
                    {value: '5', label: '5 (Extremadamente difícil)'}
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">13. ¿Has intentado resolver este problema anteriormente?</label>
                <RadioGroup 
                  value={datos.intentoResolver} 
                  onChange={v => handleChange('intentoResolver', v)}
                  options={[
                    {value: 'Si, buena solucion', label: 'Sí, encontré buena solución'},
                    {value: 'Si, no convence', label: 'Sí, pero ninguna me convence'},
                    {value: 'No he intentado', label: 'No he intentado nada'},
                    {value: 'No sabia', label: 'No sabía que se podía resolver'}
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">14. ¿Qué haces actualmente cuando te enfrentas a este problema?</label>
                <RadioGroup 
                  value={datos.queHaceActualmente} 
                  onChange={v => handleChange('queHaceActualmente', v)}
                  options={[
                    {value: 'Ignoro', label: 'Lo ignoro o me aguanto'},
                    {value: 'Busco ayuda', label: 'Busco ayuda de alguien más'},
                    {value: 'Solucion casera', label: 'Uso solución casera/temporal'},
                    {value: 'Pago solucion mala', label: 'Pago solución que no me gusta'},
                    {value: 'Busco internet', label: 'Busco opciones en internet'},
                    {value: 'Otro', label: 'Otro'}
                  ]} 
                />
              </div>
            </div>
          )}

          {seccionActual === 5 && (
            <div style={{animation: 'fadeIn 0.3s ease'}}>
              <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Sección 5: Validación de la Solución</h2>
              
              <div className="mb-6 bg-emerald-900/40 p-4 rounded-xl border-l-4 border-emerald-500">
                <p className="text-sm text-emerald-400 font-bold mb-1">Nuestra propuesta de solución:</p>
                <p className="text-white italic">"{proyectoInfo.beneficio}"</p>
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">15. Si existiera un servicio/producto que ofrezca lo anterior, ¿lo usarías o comprarías?</label>
                <RadioGroup 
                  value={datos.usariaSolucion} 
                  onChange={v => handleChange('usariaSolucion', v)}
                  options={[
                    {value: 'Si, definitivamente', label: 'Sí, definitivamente'},
                    {value: 'Tal vez', label: 'Tal vez, depende de los detalles'},
                    {value: 'No me interesa', label: 'No me interesa'}
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">16. Si el producto/servicio estuviera disponible, ¿con qué frecuencia lo comprarías o usarías?</label>
                <RadioGroup 
                  value={datos.frecuenciaCompra} 
                  onChange={v => handleChange('frecuenciaCompra', v)}
                  options={[
                    {value: 'Todos los dias', label: 'Todos los días'},
                    {value: '3-5 veces semana', label: '3-5 veces por semana'},
                    {value: '1-2 veces semana', label: '1-2 veces por semana'},
                    {value: '1 vez semana', label: '1 vez por semana'},
                    {value: '1 vez mes', label: '1 vez al mes'},
                    {value: 'Rara vez', label: 'Rara vez'},
                    {value: 'Nunca', label: 'Nunca'}
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">17. Cuando compres o uses este producto/servicio, ¿cuántas unidades o porciones adquirirías por vez?</label>
                <RadioGroup 
                  value={datos.unidadesPorVez} 
                  onChange={v => handleChange('unidadesPorVez', v)}
                  options={[
                    {value: '1', label: '1'},
                    {value: '2', label: '2'},
                    {value: '3', label: '3'},
                    {value: '4 o mas', label: '4 o más'}
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">18. ¿En qué momento o situación preferirías usar o consumir este producto/servicio? (Puedes marcar más de una)</label>
                <CheckboxGroup 
                  values={datos.momentoUso} 
                  onChange={v => handleCheckboxArray('momentoUso', v)}
                  options={[
                    'Mañana / Inicio del día', 'Mediodía / Almuerzo', 'Tarde / Merienda', 'Noche / Cena', 'Fines de semana', 'Momentos de estrés o prisa', 'Otro'
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">19. ¿Cuánto estarías dispuesto a pagar por esto?</label>
                <RadioGroup 
                  value={datos.cuantoPagaria} 
                  onChange={v => handleChange('cuantoPagaria', v)}
                  options={[
                    {value: '<50', label: 'Menos de Bs. 50'},
                    {value: '50-150', label: 'Bs. 50 - 150'},
                    {value: '151-300', label: 'Bs. 151 - 300'},
                    {value: '301-500', label: 'Bs. 301 - 500'},
                    {value: '>500', label: 'Más de Bs. 500'},
                    {value: '0', label: 'No pagaría nada'}
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">20. ¿Qué característica crees que sería la más importante para decidirte?</label>
                <RadioGroup 
                  value={datos.caracteristicaImportante} 
                  onChange={v => handleChange('caracteristicaImportante', v)}
                  options={[
                    {value: 'Económico', label: 'Que sea muy económico'},
                    {value: 'Calidad', label: 'Que tenga calidad garantizada'},
                    {value: 'Rapidez', label: 'Que sea rápido de obtener'},
                    {value: 'Variedad', label: 'Que ofrezca mucha variedad'},
                    {value: 'Atención', label: 'Excelente servicio al cliente'},
                    {value: 'Otro', label: 'Otro'}
                  ]} 
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">21. ¿Hay algo en especial que te gustaría que tuviera o mejorara? (Opcional)</label>
                <textarea className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 text-white focus:border-[#38BDF8] focus:outline-none transition-colors min-h-[100px]" placeholder="Escribe tu opinión aquí..." value={datos.mejora} onChange={e => handleChange('mejora', e.target.value)}></textarea>
              </div>
            </div>
          )}

          {seccionActual === 6 && (
            <div style={{animation: 'fadeIn 0.3s ease'}}>
              <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Sección 6: Contacto (Opcional)</h2>
              
              <div className="mb-6">
                <label className="block text-slate-200 mb-2 font-semibold">22. ¿Te gustaría recibir más información, descuentos o noticias sobre este proyecto cuando esté listo?</label>
                <RadioGroup 
                  value={datos.quiereInfo} 
                  onChange={v => handleChange('quiereInfo', v)}
                  options={[
                    {value: 'Si', label: 'Sí, claro'},
                    {value: 'No', label: 'No, solo quería ayudar'}
                  ]} 
                />
              </div>

              {datos.quiereInfo === 'Si' && (
                <div className="mb-6" style={{animation: 'fadeIn 0.3s ease'}}>
                  <label className="block text-slate-200 mb-2 font-semibold">23. Déjanos tu correo electrónico o número de WhatsApp:</label>
                  <input type="text" placeholder="Ej: micorreo@gmail.com o +591 7..." className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 text-white focus:border-[#38BDF8] focus:outline-none transition-colors" value={datos.contacto} onChange={e => handleChange('contacto', e.target.value)} />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-4 mt-6 border-t border-slate-700">
            <button 
              type="button" 
              onClick={prevSection} 
              disabled={seccionActual === 1} 
              className="btn-detective-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              <span>Anterior</span>
            </button>
            
            {seccionActual < 6 ? (
              <button 
                type="button" 
                onClick={nextSection} 
                className="btn-detective-primary flex items-center space-x-2"
              >
                <span>Siguiente</span>
                <ChevronRight size={20} />
              </button>
            ) : (
              <button type="submit" className="btn-detective-primary">
                Enviar Respuestas
              </button>
            )}
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default EncuestaPublica;

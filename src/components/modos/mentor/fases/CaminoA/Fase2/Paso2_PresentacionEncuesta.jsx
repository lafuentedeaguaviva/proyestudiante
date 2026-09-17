import React, { useState, useEffect } from 'react';
import { Download, Link as LinkIcon, Printer, Check } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { supabase } from "../../../../../../lib/supabaseClient";

const Paso2_PresentacionEncuesta = ({ setAyudanteText, onComplete }) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const [proyectoId, setProyectoId] = useState('');
  const [proyectoInfo, setProyectoInfo] = useState({
    titulo: 'este emprendimiento',
    problema: 'el problema que mi proyecto resuelve',
    beneficio: 'un beneficio clave'
  });

  useEffect(() => {
    setAyudanteText("¡He adaptado la encuesta base a tu idea de negocio! Puedes imprimirla para encuestar en papel o copiar el link para enviarla por WhatsApp.");

    const fetchProyecto = async () => {
      try {
        const id = localStorage.getItem('temp_proyecto_id');
        if (!id) return;
        setProyectoId(id);

        const { data: pData } = await supabase
          .from('proyecto_usuario')
          .select('titulo')
          .eq('id', id)
          .single();

        let newInfo = { ...proyectoInfo };
        if (pData) newInfo.titulo = pData.titulo || newInfo.titulo;

        const { data: cData } = await supabase
          .from('contenido_proyecto')
          .select('campo_clave, contenido')
          .eq('proyecto_id', id);

        if (cData) {
          const resumenFase1 = cData.find(c => c.campo_clave === 'resumen_fase1');
          if (resumenFase1 && resumenFase1.contenido) {
            let parsed = resumenFase1.contenido;
            if (typeof parsed === 'string') {
              try { parsed = JSON.parse(parsed); } catch (e) { }
            }
            newInfo.problema = parsed.problema || newInfo.problema;
            newInfo.beneficio = parsed.solucion || newInfo.beneficio;
          } else {
            const prob = cData.find(c => c.campo_clave === 'frase_problema' || c.campo_clave === 'dolor');
            const sol = cData.find(c => c.campo_clave === 'idea_ganadora');

            if (prob && prob.contenido) {
              newInfo.problema = typeof prob.contenido === 'string' ? prob.contenido : JSON.stringify(prob.contenido);
            }
            if (sol && sol.contenido) {
              let parsedSol = sol.contenido;
              if (typeof parsedSol === 'string') {
                try { parsedSol = JSON.parse(parsedSol); } catch (e) { }
              }
              newInfo.beneficio = parsedSol.idea || newInfo.beneficio;
            }
          }
        }

        setProyectoInfo(newInfo);
      } catch (err) {
        console.error("Error fetching project data for preview:", err);
      }
    };
    fetchProyecto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAyudanteText]);

  const exportToWord = async () => {
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: { size: 18, font: "Arial" }, // 9pt font to make it fit in 1 page
            paragraph: { spacing: { line: 240 } } // Single spacing
          }
        }
      },
      sections: [{
        properties: {
          page: {
            margin: { top: 700, bottom: 700, right: 700, left: 700 } // Narrow margins
          }
        },
        children: [
          new Paragraph({
            text: "ENCUESTA DE VALIDACIÓN DE EMPRENDIMIENTO",
            heading: HeadingLevel.HEADING_2,
            alignment: "center",
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: `Hola, estoy realizando un proyecto y quiero conocer tu opinión para crear un servicio/producto relacionado con ${proyectoInfo.titulo} que realmente necesites. Tus respuestas son anónimas. ¡Gracias!`,
            spacing: { after: 200 }
          }),

          // SECCIÓN 1
          new Paragraph({ children: [new TextRun({ text: "🔴 SECCIÓN 1: DATOS PERSONALES", bold: true })], spacing: { before: 100, after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: "1. ¿Cuál es tu edad?", bold: true })] }),
          new Paragraph({ text: "   ( ) 10-13    ( ) 14-17    ( ) 18-21    ( ) 22-30    ( ) 31-45    ( ) 45-65    ( ) Más de 65", spacing: { after: 100 } }),
          
          new Paragraph({ children: [new TextRun({ text: "2. ¿Cuál es tu género?", bold: true })] }),
          new Paragraph({ text: "   ( ) Masculino    ( ) Femenino", spacing: { after: 100 } }),
          
          new Paragraph({ children: [new TextRun({ text: "3. ¿Dónde vives o estudias?", bold: true })] }),
          new Paragraph({ text: "   ( ) Zona norte    ( ) Zona sur    ( ) Zona este    ( ) Zona oeste    ( ) Centro    ( ) Otro: ________", spacing: { after: 100 } }),
          
          new Paragraph({ children: [new TextRun({ text: "4. ¿Cuál es tu nivel de estudios actual?", bold: true })] }),
          new Paragraph({ text: "   ( ) Primaria  ( ) Secundaria  ( ) Bachillerato  ( ) Téc. Sup.  ( ) Licenciatura  ( ) Posgrado  ( ) Otro", spacing: { after: 100 } }),

          // SECCIÓN 2
          new Paragraph({ children: [new TextRun({ text: "🔴 SECCIÓN 2: SITUACIÓN ECONÓMICA", bold: true })], spacing: { before: 100, after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: "5. ¿Recibes dinero para tus gastos personales?", bold: true })] }),
          new Paragraph({ text: "   ( ) Sí, mesada semanal  ( ) Mesada mensual  ( ) Trabajo 1/2 tiempo  ( ) Trabajo tiempo completo  ( ) No", spacing: { after: 100 } }),

          new Paragraph({ children: [new TextRun({ text: "6. Aproximadamente, ¿cuánto dinero tienes disponible para gastar por semana?", bold: true })] }),
          new Paragraph({ text: "   ( ) < Bs. 50    ( ) Bs. 50-150    ( ) Bs. 151-300    ( ) Bs. 301-500    ( ) > Bs. 500", spacing: { after: 100 } }),

          new Paragraph({ children: [new TextRun({ text: "7. ¿En qué sueles gastar tu dinero principalmente?", bold: true })] }),
          new Paragraph({ text: "   ( ) Comida  ( ) Transporte  ( ) Ropa/Calzado  ( ) Entretenimiento  ( ) Tecnología  ( ) Ahorro  ( ) Otro", spacing: { after: 100 } }),

          // SECCIÓN 3
          new Paragraph({ children: [new TextRun({ text: "🔴 SECCIÓN 3: HÁBITOS Y COMPORTAMIENTO", bold: true })], spacing: { before: 100, after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: `8. ¿Con qué frecuencia realizas actividades relacionadas con: "${proyectoInfo.problema}"?`, bold: true })] }),
          new Paragraph({ text: "   ( ) Todos los días  ( ) 2-3 veces/sem  ( ) 1 vez/sem  ( ) 1 vez/mes  ( ) Rara vez  ( ) Nunca", spacing: { after: 100 } }),

          new Paragraph({ children: [new TextRun({ text: "9. ¿Qué es lo más importante para ti al momento de elegir un producto/servicio similar?", bold: true })] }),
          new Paragraph({ text: "   ( ) Precio bajo  ( ) Calidad  ( ) Ecológico  ( ) Rápido/Fácil  ( ) Moda/Tendencia  ( ) Atención", spacing: { after: 100 } }),

          new Paragraph({ children: [new TextRun({ text: "10. ¿Dónde sueles buscar o adquirir este tipo de producto/servicio?", bold: true })] }),
          new Paragraph({ text: "   ( ) Colegio/U.  ( ) Tiendas barrio  ( ) Supermercados  ( ) En línea (redes)  ( ) Yo mismo  ( ) Otro", spacing: { after: 100 } }),

          new Paragraph({ children: [new TextRun({ text: "11. ¿Qué redes sociales usas con más frecuencia?", bold: true })] }),
          new Paragraph({ text: "   ( ) Instagram  ( ) TikTok  ( ) WhatsApp  ( ) Facebook  ( ) YouTube  ( ) X (Twitter)  ( ) Otra", spacing: { after: 100 } }),

          // SECCIÓN 4
          new Paragraph({ children: [new TextRun({ text: "🔴 SECCIÓN 4: VALIDACIÓN DEL PROBLEMA", bold: true })], spacing: { before: 100, after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: `12. En una escala del 1 al 5, ¿qué tan difícil o frustrante te resulta lidiar con: "${proyectoInfo.problema}"?`, bold: true })] }),
          new Paragraph({ text: "   ( ) 1 (Nada difícil)    ( ) 2    ( ) 3    ( ) 4    ( ) 5 (Extremadamente difícil)", spacing: { after: 100 } }),

          new Paragraph({ children: [new TextRun({ text: "13. ¿Has intentado resolver este problema anteriormente?", bold: true })] }),
          new Paragraph({ text: "   ( ) Encontré buena solución  ( ) Ninguna me convence  ( ) No he intentado  ( ) No sabía que se podía", spacing: { after: 100 } }),

          new Paragraph({ children: [new TextRun({ text: "14. ¿Qué haces actualmente cuando te enfrentas a este problema?", bold: true })] }),
          new Paragraph({ text: "   ( ) Lo ignoro  ( ) Busco ayuda  ( ) Solución temporal  ( ) Pago por mala solución  ( ) Busco en internet", spacing: { after: 100 } }),

          // SECCIÓN 5
          new Paragraph({ children: [new TextRun({ text: "🔴 SECCIÓN 5: VALIDACIÓN DE LA SOLUCIÓN", bold: true })], spacing: { before: 100, after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: `15. Si existiera un producto/servicio que ofrezca: "${proyectoInfo.beneficio}", ¿lo usarías/comprarías?`, bold: true })] }),
          new Paragraph({ text: "   ( ) Sí, definitivamente    ( ) Tal vez, depende de los detalles    ( ) No me interesa", spacing: { after: 100 } }),

          new Paragraph({ children: [new TextRun({ text: "16. ¿Cuánto estarías dispuesto a pagar por esto?", bold: true })] }),
          new Paragraph({ text: "   ( ) < Bs. 50    ( ) Bs. 50-150    ( ) Bs. 151-300    ( ) Bs. 301-500    ( ) > Bs. 500    ( ) No pagaría", spacing: { after: 100 } }),

          new Paragraph({ children: [new TextRun({ text: "17. ¿Qué característica crees que sería la más importante para que decidas usarlo?", bold: true })] }),
          new Paragraph({ text: "   ( ) Económico  ( ) Calidad  ( ) Rápido  ( ) Variedad  ( ) Excelente servicio  ( ) Otro", spacing: { after: 100 } }),

          new Paragraph({ children: [new TextRun({ text: "18. ¿Hay algo en especial que te gustaría que tuviera, mejorara o incluyera?", bold: true })] }),
          new Paragraph({ text: "   __________________________________________________________________________________________", spacing: { after: 100 } }),

          // SECCIÓN 6
          new Paragraph({ children: [new TextRun({ text: "🔴 SECCIÓN 6: CONTACTO (Opcional)", bold: true })], spacing: { before: 100, after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: "19. ¿Te gustaría recibir más información, descuentos o noticias sobre este proyecto cuando esté listo?", bold: true })] }),
          new Paragraph({ text: "   ( ) Sí, claro    ( ) No, solo quería ayudar con la encuesta", spacing: { after: 100 } }),

          new Paragraph({ children: [new TextRun({ text: "20. Si respondiste SÍ, por favor déjanos tu correo electrónico o número de WhatsApp:", bold: true })] }),
          new Paragraph({ text: "   __________________________________________________________________________________________", spacing: { after: 100 } }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Encuesta_Validacion.docx");
  };

  const copyLink = () => {
    const finalProjectId = proyectoId || 'proyecto-demo';
    const publicLink = `${window.location.origin}/encuesta/${finalProjectId}`;
    navigator.clipboard.writeText(publicLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  return (
    <div style={{ padding: '1rem', color: '#0f172a', maxWidth: '900px', margin: '0 auto' }}>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={exportToWord} style={{ flex: 1, padding: '1rem', background: '#2563eb', color: '#0f172a', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
          <Download size={20} /> Descargar en Word
        </button>
        <button onClick={() => window.print()} style={{ flex: 1, padding: '1rem', background: '#475569', color: '#0f172a', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
          <Printer size={20} /> Imprimir Directo
        </button>
        <button onClick={copyLink} style={{ flex: 1, padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
          {linkCopied ? <Check size={20} /> : <LinkIcon size={20} />}
          {linkCopied ? "¡Enlace Copiado!" : "Copiar Link en Línea"}
        </button>
      </div>

      <div className="printable-survey" style={{ background: 'white', color: 'black', padding: '3rem', borderRadius: '0.5rem', fontFamily: 'Arial, sans-serif', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>ENCUESTA DE VALIDACIÓN DE EMPRENDIMIENTO</h1>
        <h2 style={{ textAlign: 'center', fontSize: '1.1rem', color: '#4b5563', marginBottom: '2rem' }}>Para estudiantes de bachillerato</h2>

        <p style={{ fontStyle: 'italic', background: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
          <strong>📌 PRESENTACIÓN:</strong> Hola, soy estudiante del colegio. Estoy realizando un proyecto de emprendimiento y quiero conocer tu opinión para crear un servicio/producto relacionado con <strong>{proyectoInfo.titulo}</strong> que realmente necesites. Tus respuestas son anónimas y me ayudarán muchísimo. ¡Gracias! 😊
        </p>

        <h3 style={{ borderBottom: '2px solid #ef4444', color: '#ef4444', paddingBottom: '0.5rem', marginTop: '2rem', marginBottom: '1rem' }}>🔴 SECCIÓN 1: DATOS PERSONALES</h3>
        <p style={{ marginBottom: '0.5rem' }}><strong>1. ¿Cuál es tu edad?</strong><br />☐ 10-13 ☐ 14-17 ☐ 18-21 ☐ 22-30 ☐ 31-45 ☐ 45-65 ☐ Más de 65</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>2. ¿Cuál es tu género?</strong><br />☐ Masculino ☐ Femenino</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>3. ¿Dónde vives o estudias?</strong><br />☐ Zona norte ☐ Zona sur ☐ Zona este ☐ Zona oeste ☐ Centro ☐ Otro: _______</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>4. ¿Cuál es tu nivel de estudios actual?</strong><br />☐ Primaria ☐ Secundaria (cursando) ☐ Bachillerato ☐ Técnico Superior ☐ Licenciatura ☐ Posgrado ☐ Otro: _______</p>

        <h3 style={{ borderBottom: '2px solid #ef4444', color: '#ef4444', paddingBottom: '0.5rem', marginTop: '2rem', marginBottom: '1rem' }}>🔴 SECCIÓN 2: SITUACIÓN ECONÓMICA</h3>
        <p style={{ marginBottom: '0.5rem' }}><strong>5. ¿Recibes dinero para tus gastos personales?</strong><br />☐ Sí, mesada semanal ☐ Sí, mesada mensual ☐ Sí, trabajo medio tiempo ☐ Sí, trabajo tiempo completo ☐ No recibo dinero</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>6. Aproximadamente, ¿cuánto dinero tienes disponible para gastar por semana?</strong><br />☐ Menos de Bs. 50 ☐ Bs. 50 - 150 ☐ Bs. 151 - 300 ☐ Bs. 301 - 500 ☐ Más de Bs. 500</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>7. ¿En qué sueles gastar tu dinero principalmente? (Puedes marcar más de una)</strong><br />☐ Comida / Alimentos ☐ Transporte ☐ Ropa / Calzado ☐ Entretenimiento (cine, juegos) ☐ Tecnología (celular, internet) ☐ Ahorro ☐ Otro: _______</p>

        <h3 style={{ borderBottom: '2px solid #ef4444', color: '#ef4444', paddingBottom: '0.5rem', marginTop: '2rem', marginBottom: '1rem' }}>🔴 SECCIÓN 3: HÁBITOS Y COMPORTAMIENTO</h3>
        <p style={{ marginBottom: '0.5rem' }}><strong>8. ¿Con qué frecuencia realizas actividades relacionadas con: "{proyectoInfo.problema}"?</strong><br />☐ Todos los días ☐ 2-3 veces por semana ☐ 1 vez por semana ☐ 1 vez al mes ☐ Rara vez ☐ Nunca</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>9. ¿Qué es lo más importante para ti al momento de elegir un producto/servicio similar?</strong><br />☐ Precio bajo ☐ Buena calidad ☐ Saludable/Ecológico ☐ Rápido y fácil de conseguir ☐ De moda/Tendencia ☐ Excelente atención al cliente</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>10. ¿Dónde sueles buscar o adquirir este tipo de producto/servicio?</strong><br />☐ Colegio/universidad/trabajo ☐ Tiendas de barrio cercanas ☐ Supermercados/centros comerciales ☐ En línea (internet, redes) ☐ Lo preparo yo mismo ☐ Otro: _______</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>11. ¿Qué redes sociales usas con más frecuencia? (Puedes marcar más de una)</strong><br />☐ Instagram ☐ TikTok ☐ WhatsApp ☐ Facebook ☐ YouTube ☐ X (Twitter) ☐ Otra: _______</p>

        <h3 style={{ borderBottom: '2px solid #ef4444', color: '#ef4444', paddingBottom: '0.5rem', marginTop: '2rem', marginBottom: '1rem' }}>🔴 SECCIÓN 4: VALIDACIÓN DEL PROBLEMA</h3>
        <div style={{ padding: '0.5rem', background: '#fff1f2', borderLeft: '4px solid #f43f5e', marginBottom: '1rem' }}>
          <strong>Contexto:</strong> <em>"{proyectoInfo.problema}"</em>
        </div>
        <p style={{ marginBottom: '0.5rem' }}><strong>12. En una escala del 1 al 5, ¿qué tan difícil o frustrante te resulta lidiar con este problema?</strong><br />☐ 1 (Nada difícil) ☐ 2 ☐ 3 ☐ 4 ☐ 5 (Extremadamente difícil)</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>13. ¿Has intentado resolver este problema anteriormente?</strong><br />☐ Sí, encontré una buena solución ☐ Sí, pero ninguna me convence ☐ No he intentado nada ☐ No sabía que se podía resolver</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>14. ¿Qué haces actualmente cuando te enfrentas a este problema?</strong><br />☐ Lo ignoro/aguanto ☐ Busco ayuda de alguien ☐ Uso solución casera/temporal ☐ Pago por solución que no me gusta ☐ Busco opciones en internet ☐ Otro: _______</p>

        <h3 style={{ borderBottom: '2px solid #ef4444', color: '#ef4444', paddingBottom: '0.5rem', marginTop: '2rem', marginBottom: '1rem' }}>🔴 SECCIÓN 5: VALIDACIÓN DE LA SOLUCIÓN</h3>
        <div style={{ padding: '0.5rem', background: '#ecfdf5', borderLeft: '4px solid #10b981', marginBottom: '1rem' }}>
          <strong>Solución propuesta:</strong> <em>"{proyectoInfo.beneficio}"</em>
        </div>
        <p style={{ marginBottom: '0.5rem' }}><strong>15. Si existiera un servicio/producto que ofrezca lo anterior, ¿lo usarías o comprarías?</strong><br />☐ Sí, definitivamente ☐ Tal vez, depende de los detalles ☐ No me interesa</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>16. ¿Cuánto estarías dispuesto a pagar por esto?</strong><br />☐ Menos de Bs. 50 ☐ Bs. 50 - 150 ☐ Bs. 151 - 300 ☐ Bs. 301 - 500 ☐ Más de Bs. 500 ☐ No pagaría nada</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>17. ¿Qué característica crees que sería la más importante para decidirte?</strong><br />☐ Económico ☐ Calidad garantizada ☐ Rápido de obtener ☐ Mucha variedad ☐ Excelente servicio al cliente ☐ Otro: _______</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>18. ¿Hay algo en especial que te gustaría que tuviera o mejorara?</strong><br />__________________________________________________________________________</p>

        <h3 style={{ borderBottom: '2px solid #ef4444', color: '#ef4444', paddingBottom: '0.5rem', marginTop: '2rem', marginBottom: '1rem' }}>🔴 SECCIÓN 6: CONTACTO (Opcional)</h3>
        <p style={{ marginBottom: '0.5rem' }}><strong>19. ¿Te gustaría recibir más información, descuentos o noticias sobre este proyecto cuando esté listo?</strong><br />☐ Sí, claro ☐ No, solo quería ayudar con la encuesta</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>20. Si respondiste SÍ, por favor déjanos tu correo electrónico o número de WhatsApp:</strong><br />__________________________________________________________________________</p>

      </div>

      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <button onClick={onComplete} style={{ padding: '0.75rem 2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
          Ya compartí / imprimí la encuesta
        </button>
      </div>

      {/* CSS para forzar que solo se imprima la hoja blanca al usar Ctrl+P */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-survey, .printable-survey * {
            visibility: visible;
          }
          .printable-survey {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            box-shadow: none !important;
          }
        }
      `}} />
    </div>
  );
};

export default Paso2_PresentacionEncuesta;

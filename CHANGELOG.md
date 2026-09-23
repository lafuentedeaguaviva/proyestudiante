# 📋 CHANGELOG — Plataforma Gamificada de Emprendimiento

Todas las versiones y cambios notables de este proyecto están documentados aquí.

---

## [v1.2.1] — 2026-09-23

### 🐛 Correcciones (Hotfixes)
- **Persistencia de Sesión (F5):** Implementado `ProtectedRoute` envolviendo todas las rutas en `AppRouter.jsx` para evitar cierres de sesión accidentales al refrescar la página.
- **Guardado de Videos (Base de Datos):** Creado script SQL para aplicar una restricción `UNIQUE` en la tabla `prompts_ia` permitiendo que Supabase procese los `upsert` correctamente al configurar los videos de la plataforma.
- **Seguridad RLS (Base de Datos):** Creado script SQL para habilitar Row-Level Security en la tabla `prompts_ia` con los permisos necesarios de lectura y escritura.
- **Reproductor de YouTube:** Actualizada la lógica de extracción de URLs de YouTube en `api.js` usando expresiones regulares robustas para soportar formatos complejos de URL.

---

## [v1.2.0] — 2026-09-23

### ✨ Nuevas Características

#### 👑 Panel de Administrador Premium
- Creación de un **Centro de Mando Premium** para administradores.
- Menú lateral moderno con efecto *Glassmorphism* y animaciones usando **Framer Motion**.
- Sub-pestañas integradas para gestionar **Usuarios**, **Prompts**, **Videos** y **Configuración**.
- Rutas protegidas (`ProtectedAdminRoute`) asegurando que solo perfiles con rol de `admin` tengan acceso.
- Ícono de engranaje (⚙️) dinámico en el Dashboard visible únicamente para administradores.

### 🐛 Correcciones (Auth)
- Refactorización de la función de `Cerrar Sesión` (`signOut`). Ahora incluye una limpieza forzada de `localStorage` y `sessionStorage` para asegurar el borrado total de la caché de sesión y prevenir inicios automáticos fantasma (Race conditions).
- Ajustes en el flujo de `LoginScreen` para estabilizar el proceso de creación de "Nuevos Usuarios" evitando bloqueos infinitos de validación con Supabase.

---

## [v1.1.0] — 2026-09-19

### ✨ Nuevas Características

#### 📊 Proyecciones Financieras Dinámicas (Fase 10)
- Las proyecciones de **Ganancias, Gastos y Utilidad Neta** se calculan automáticamente en tiempo real.
- Se aplica un **crecimiento mensual del 13%** sobre las unidades vendidas, simulando el crecimiento orgánico del negocio.
- Se aplica un descuento del **16% por impuestos** (IVA 13% + IT 3%) directamente sobre los ingresos de cada mes.
- Los cálculos son idénticos entre la pantalla de la plataforma y el Documento Word exportado.

#### 📄 Documento Final Word Mejorado (docxGenerator)
- **Tablas horizontales** por mes (Mes 1 → Mes 6) para las proyecciones de Ingresos, Gastos y Utilidad.
- Desglose explícito de **Costos Fijos** y **Costos Variables** con su comportamiento por mes.
- El **Punto de Equilibrio** se calcula usando la fórmula: `CF / (Precio - Costo Variable Unitario)`.
- La tabla de **VAN y TIR** incluye la condición de interpretación (genera/destruye valor).
- Se eliminó la sección **4.7 Viabilidad y Sostenibilidad** (tabla KPIs) para evitar redundancia.

#### 🤖 Interpretación IA de Viabilidad (Fase 13)
- La **Fase 13 (Documento con IA)** ahora calcula el VAN y la TIR en tiempo real antes de enviar el prompt.
- La IA recibe los valores exactos del proyecto (`VAN = X, TIR = Y%`) para generar una **interpretación ejecutiva precisa y positiva**.
- Se elimina el problema anterior donde la IA indicaba que "no había VAN/TIR definido".

#### 🧠 Prompt IA Fase 10 Actualizado
- El prompt de **Autocompletar con IA** de la Fase 10 fue actualizado para informar a la IA sobre las reglas del sistema dinámico.
- La IA ahora genera una `produccionMensual`, `precios` e `inversiones` calibradas para que el resultado final tenga un **VAN positivo y una TIR > TMAR**.
- Las proyecciones ya no las genera la IA (devuelve array vacío), sino el sistema para garantizar consistencia.

---

### 🐛 Correcciones

- **Error de redeclaración:** Se resolvió el error `costoVariableUnitario has already been declared` en `docxGenerator.js`.
- **Error de temporal dead zone:** Se resolvió el error `can't access lexical declaration 'totalInversion' before initialization` moviendo la declaración antes de su primer uso.
- **Interpretación genérica de IA:** La IA ya no dice frases como "aunque no cuenta con VAN definido en este momento". Ahora siempre recibe los números precisos calculados.

---

### 📁 Archivos Modificados

| Archivo | Tipo de Cambio |
|---|---|
| `src/lib/docxGenerator.js` | Mayor — Cálculo dinámico completo |
| `src/pages/Fase13_DocumentoIA.jsx` | Mayor — Cálculo VAN/TIR para prompt IA |
| `src/services/api.js` | Menor — Prompt Fase 10 actualizado |
| `src/pages/Fase10_PlanFinanciero.jsx` | Menor — Ajustes de integración |
| `src/pages/Fase11_DocumentoFinal.jsx` | Menor — Ajustes de exportación |
| `src/AppRouter.jsx` | Menor — Rutas |
| `src/controllers/useFase10Controller.js` | Menor — Controlador financiero |
| Otros controladores (Fase 7–12) | Menor — Mejoras acumuladas |

---

## [v1.0.0] — Versión Inicial

### ✨ Lanzamiento Inicial

- Plataforma gamificada de emprendimiento con 13 fases.
- Sistema de progresión por fases con guardado automático en Supabase.
- Integración con IA (DeepSeek) para autocompletar contenido en cada fase.
- Exportación de Documento Final en formato Word (`.docx`).
- Dashboard del estudiante con seguimiento de progreso.
- Modo Mentor con pasos guiados y retroalimentación inteligente.
- Soporte para múltiples mundos/entornos de aprendizaje.

---

> 📌 Este proyecto sigue el estándar [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).
> Los números de versión siguen [Semantic Versioning](https://semver.org/lang/es/).

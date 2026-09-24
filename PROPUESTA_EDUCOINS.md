# 🪙 Propuesta de Implementación: Sistema de EduCoins

Esta propuesta detalla la arquitectura, el análisis de costos y el plan de desarrollo para implementar un sistema de economía virtual (**EduCoins**) que limite y controle el uso de la Inteligencia Artificial (DeepSeek) dentro de la plataforma.

## 1. Reglas del Sistema (La Economía de EduCoins)
- **Costo por acción:** Cada vez que un estudiante hace clic en un botón que consume IA (ej. "Validar con IA", "Generar Documento", "Lluvia de Ideas"), se descuenta **1 EduCoin**.
- **Billetera Inicial:** Al registrarse, cada estudiante recibe un bono de **50 EduCoins** (suficientes para completar todo el proyecto con un margen de error/reintentos).
- **Bloqueo Inteligente:** Si el saldo de EduCoins llega a `0`, los botones de IA se desactivan visualmente y se muestra una alerta: *"Te has quedado sin EduCoins. Solicita más a tu mentor/administrador."*
- **Control Administrativo:** El Administrador, desde su panel premium, puede ver el saldo de cada estudiante y recargarles EduCoins de forma manual (ej. sumar +20 monedas).

---

## 2. Análisis de Costos (Estimación en Bolivia)

Actualmente, la plataforma utiliza la API de **DeepSeek**, la cual es una de las más económicas y potentes del mercado.

### Costos Base (DeepSeek V3 / Chat)
- **Input (Lo que lee la IA):** ~$0.14 USD por 1 millón de tokens.
- **Output (Lo que escribe la IA):** ~$0.28 USD por 1 millón de tokens.
- **Promedio por interacción en la plataforma:** ~2,000 tokens de entrada + ~1,000 tokens de salida.
- **Costo Real por Clic (1 EduCoin):** ~$0.00056 USD.

### Costo Total por Proyecto Estudiantil
Para que un estudiante termine las 13 Fases, realizará aproximadamente **30 interacciones con la IA**.
- 30 interacciones * $0.00056 USD = **$0.0168 USD** por estudiante.
- Tipo de cambio estimado: 1 USD = 6.96 Bs (Oficial) a ~10.00 Bs (Paralelo bancario tarjetas). Para la estimación usaremos un promedio conservador de **8.00 Bs**.
- **Costo total por estudiante: 0.13 Bs (13 centavos de Boliviano).**

### Ejemplo a Escala
Si tienes **100 estudiantes** utilizando la plataforma activamente y completando todo su proyecto:
- **Consumo Total:** 3,000 interacciones (3,000 EduCoins).
- **Costo en USD:** ~$1.68 USD.
- **Costo en BOB:** **~13.44 Bolivianos.**

*Conclusión:* El costo operativo de la IA es extremadamente bajo. Darle a cada estudiante **50 EduCoins** gratis cuesta literalmente 30 centavos de Boliviano.

---

## 3. Plan de Desarrollo Tecnológico (Paso a Paso)

Para implementar este sistema, necesitamos realizar los siguientes cambios técnicos en el código:

### Fase 1: Base de Datos (Supabase)
1. Modificar la tabla `usuarios` (o perfil) para añadir la columna `educoins` (Tipo: Integer, Default: 50).
2. Crear un trigger o función segura (`RPC` en PostgreSQL) para restar `-1` EduCoin de forma atómica cada vez que se consuma, evitando hackeos.

### Fase 2: Interfaz del Estudiante
1. **Navbar/Header:** Añadir un pequeño contador con un ícono de moneda (🪙 50) siempre visible en la parte superior derecha para que el estudiante vea su saldo.
2. **Bloqueo de Interfaz:** Modificar la función que llama a la IA para que primero verifique `if (educoins <= 0) { mostrarAlerta(); return; }`.

### Fase 3: Panel del Administrador
1. En el **Centro de Mando Premium**, ir a la pestaña "Usuarios".
2. Añadir una columna que muestre el saldo de EduCoins de cada estudiante.
3. Añadir un botón de **"Recargar 🪙"** que abra un modal para sumar una cantidad específica de monedas a un usuario (ej. +10, +50) mediante una llamada a Supabase.

---

## ¿Estás de acuerdo con este plan?
Si el modelo te parece correcto (1 Clic = 1 EduCoin = 50 monedas iniciales), confírmame y puedo empezar a programar la base de datos y la interfaz de usuario en el siguiente paso.

# 🎸 CuerdaViva! — Plataforma Interactiva de Guitarra (Teoría, Práctica & Folclor)

Plataforma web gamificada al mejor estilo **Duolingo** para aprender, practicar y perfeccionar guitarra acústica/clásica desde nivel básico hasta intermedio, con enfoque en **Alabanzas Católicas** y **Folclor Colombiano** (**Vallenatos, Cumbias, Porros, Pasillos y Bambucos**), junto al **Método Numérico de Keyner Ramírez Mojica** (*Haga Música con la Guitarra*).

Optimizado al 100% para computadores de escritorio, portátiles y **teléfonos celulares (iOS Safari y Android Chrome)** con controles táctiles ergonómicos, desbloqueo automático de audio Web Audio API y diseño responsivo fluido.

Repositorio oficial: [https://github.com/cristianjaviercano/cuerda_viva](https://github.com/cristianjaviercano/cuerda_viva)

---

## ✨ Características Principales

### 1. 🏠 Ruta Gamificada Estilo Duolingo (`9 Unidades · 36 Lecciones · 150+ Retos`)
* **Mecánicas Gamificadas**: XP ⚡, Racha de días 🔥, Vidas ❤️, niveles progresivos y efectos de sonido en tiempo real.
* **Ciclo de Aprendizaje Completo & Remediación Obligatoria**:
  - Cada reto evalúa un concepto teórico respaldado por la biblioteca pedagógica (`THEORY_LIBRARY`).
  - Si el estudiante comete un error, el sistema bloquea el avance desordenado y activa la **fase de remediación**: se explica la teoría exacta con ilustraciones y ejemplos sonoros, permitiendo repetir y consolidar el aprendizaje antes de finalizar el módulo.
* **Registro de Estudiantes & Bitácora**:
  - Múltiples perfiles de usuario.
  - Registro pormenorizado de **Aciertos** y **No Aciertos**.
  - Monitor de teorías pendientes de repaso y tasas de consolidación.
  - Exportación de métricas en **CSV** (compatible con Excel) y **JSON**.

### 2. 📖 Método Numérico de Keyner Ramírez Mojica (*Haga Música con la Guitarra*)
* **Notación Cifra Cuerda-Traste (`10–60`)**:
  - `10` = 1ª cuerda al aire, `11` = 1ª cuerda traste 1, `43` = 4ª cuerda traste 3, etc.
  - Símbolos armónicos auténticos del libro: `DO+` (Mayor), `LA-` (Menor), `5ª DO` (7ª Dominante), disminuidos y alteraciones.
* **Canciones del Método**: *Pueblito Viejo*, *Oropel*, *Espumas*, *El Pescador de mi Tierra*, *Carmen de Bolívar*, *El Año Viejo*.
* **Ilustraciones Técnicas**: Láminas anatómicas de partes de la guitarra, posturas (Clásica y Flamenca/Popular), numeración de dedos (Pulgar, Índice, Medio, Anular) y mapa numérico del diapasón.

### 3. 📐 Estudio 3D Interactivo de la Guitarra (Three.js)
* Modelo tridimensional interactivo de la guitarra acústica con madera, clavijero, cejuela, mástil, trastes de níquel y 6 cuerdas vibrantes.
* Rotación 360°, zoom orbital táctil con gestos en móvil (`touch-action: manipulation`).
* Resaltado visual en 3D de notas y acordes en tiempo real.

### 4. 🎙️🔌 Entrada de Micrófono + Conexión Directa USB (Hi-Z) & Afinador
* Conecta tu guitarra mediante interfaz USB / cable directo o usa el micrófono del equipo/celular.
* Selector de canales estéreo (`Canal 1 + 2`, `Solo Canal 1`, `Solo Canal 2 Hi-Z`).
* Preamplificador digital (0.5x – 8.0x) y filtro antirruido (*Noise Gate*).
* Afinador cromático con aguja visual en tiempo real y cuerdas de referencia afinadas en E-A-D-G-B-e.
* Algoritmo YIN para detección monofónica y análisis espectral FFT Chroma para acordes.

### 5. 🎯 Estudio de Tablaturas Interactivas (TAB)
* 25+ tablaturas con colores vivos de punteos vallenatos (*Los Caminos de la Vida*, *La Gota Fría*, *Ausencia Sentimental*, *Sin Medir Distancias*, *Matilde Lina*, *Alicia Adorada*, *La Piragua*), cantos católicos (*Pescador de Hombres*, *Dios Está Aquí*, *Nadie Te Ama Como Yo*, *Alma Misionera*, *Junto a Ti María*, *Tan Cerca de Mí*) e intros clásicas colombianas.
* Modo "Espera mi Guitarra", control de velocidad (50% – 125%), bucle A-B y síntesis de Nylon, Requinto y Acordeón.

### 6. 🎶 Cancionero & Progresiones de Acordes (`150+ Canciones`)
* Línea de tiempo interactiva con grados armónicos (`I`, `IV`, `V7`, `VIm`).
* Letras con acordes alineados sílaba a sílaba, transposición tonal instantánea y calculadora de Capotraste.
* Validación sonora de acordes en tiempo real.

### 7. 🥁 Laboratorio de Rasgueos y Percusión Folclórica / Litúrgica
* 18 patrones auténticos: Paseo Vallenato, Merengue Vallenato, Son, Puya, Cumbia Colombiana, Porro, Pasillo, Bambuco, Guabina, Bolero, Balada Litúrgica, Pop con Chasquido y Arpegios.
* Síntesis en Web Audio de percusión autóctona: Caja Vallenata, Guacharaca, Tambor Llamador y Maracón.

---

## 📱 Experiencia Móvil (Celulares y Tablets)

* **Desbloqueo de Audio Táctil**: Compatible con las políticas de auto-play restrictivas de iOS Safari y Android Chrome. Un toque en cualquier parte de la pantalla inicializa y reanuda el `AudioContext` sin retrasos.
* **Barra de Navegación Deslizable**: Pestañas horizontales fluidas con inercia táctil (`-webkit-overflow-scrolling: touch`).
* **Diapasón y Tablaturas Touch**: Desplazamiento horizontal sin saltos ni cortes de columnas.
* **Modales Adaptativos**: Optimizados para pantallas desde 320px hasta 6.7" (iPhone mini, estándar, Pro Max y dispositivos Android).

---

## 🚀 Instalación y Ejecución Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/cristianjaviercano/cuerda_viva.git
cd cuerda_viva

# 2. Iniciar el servidor local
npm start
# o alternativamente: node server.js
```

Abre en tu navegador favorito:
👉 **http://localhost:8080** (o el puerto asignado en consola).

---

## ☁️ Despliegue en Vercel

La plataforma incluye configuración nativa para **Vercel** (`vercel.json` y función serverless en `api/index.js`):

### Opción A: Despliegue Automático por Git (Recomendada)
1. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **Add New Project** e importa el repositorio `cristianjaviercano/cuerda_viva`.
3. Vercel detectará la configuración automáticamente. Haz clic en **Deploy**.
4. ¡Listo! Tendrás tu enlace de producción HTTPS activo en segundos.

### Opción B: Despliegue con Vercel CLI
```bash
npx vercel --prod
```

---

## 🧪 Pruebas y Auditoría Automatizada

Para ejecutar el banco integral de pruebas (984+ verificaciones):

```bash
node audit_platform.mjs
```

---

## 📄 Licencia

Licencia MIT — Desarrollado con ❤️ para la enseñanza musical de la guitarra, la alabanza y la preservación del folclor colombiano.

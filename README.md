# 🎛️ Arena de Datos Musicales / Music Disc Dashboard

Un dashboard analítico interactivo y responsivo de alto rendimiento desarrollado con **React (TypeScript)**, **Vite** y **Material UI (MUI v6)**, conectado en tiempo real a **Firebase Realtime Database**. La plataforma permite explorar, filtrar e interpretar la evolución macroeconómica y tecnológica de la industria musical estadounidense basándose en los datos históricos oficiales de las certificaciones de la RIAA (1973 - 2022).

### 🚀 [Explorar Dashboard en Vivo](https://exavier0154d.github.io/Music-Disc-Dashboard/)

---

## 💎 Características Principales y Funcionalidades

### 1. Panel de Control Maestro (Filtro Tecnológico Global)
* **¿Qué hace?** Controla el estado y el renderizado dinámico de todo el dashboard mediante un componente de selección flotante (`FormControl` + `Select`) con animaciones de enfoque e iluminación neón interactiva.
* **¿Por qué se construyó?** Siguiendo las leyes de usabilidad de Norman, proporciona un punto de control centralizado y al alcance inicial de la vista para segmentar los datos de inmediato por eras tecnológicas (ej. Vinilos, CDs, Streaming).

### 2. Capa de Indicadores Clave en Tiempo Real (MUI Grid KpiCards)
* **¿Qué hace?** Procesa los datos en memoria en milisegundos calculando de forma síncrona tres métricas analíticas:
  * **Ingresos Totales (Filtro):** Sumatoria indexada en billones de dólares nominales o ajustados.
  * **Volumen de Unidades Vendidas:** Agregado de distribución física/digital en millones.
  * **Pico Máximo de Ingresos:** Identificación automática del año de cúspide comercial.
* **¿Por qué se construyó?** Proporciona un resumen analítico instantáneo (Executive Summary) de la salud financiera del formato seleccionado sin sobrecargar cognitivamente al usuario.

### 3. Visualización de Series de Tiempo (`RevenueChart` con Recharts)
* **¿Qué hace?** Renderiza un gráfico analítico avanzado que ilustra la tendencia central histórica. Cuenta con microinteracciones al pasar el mouse (tooltips dinámicos personalizados) y sincronización cromática con la paleta de colores del ecosistema.
* **¿Por qué se construyó?** Permite identificar patrones de macro-tendencias, caídas de mercado y disrupciones industriales completas (como la transición del formato físico al streaming) a lo largo de cinco décadas.

### 4. Bloque Contextual Premium: Hito de la Era
* **¿Qué hace?** Una tarjeta interactiva que combina datos cuantitativos de la base de datos con hitos de la cultura popular (ej. el impacto de *Stranger Things* en las regalías de sincronización de Kate Bush, o el fenómeno de *Thriller* de Michael Jackson). Cuenta con una marca de agua responsiva (`StarIcon`) acelerada por hardware que rota y brilla en oro neón al pasar el cursor (`:hover`).
* **¿Por qué se construyó?** Humaniza la información fría de los gráficos conectando los picos de facturación económica con las disrupciones socioculturales reales de la industria de la música.

### 5. Duelo en Vivo: Versus Histórico Cruzado
* **¿Qué hace?** Permite al usuario seleccionar dos formatos independientes cualesquiera en tiempo real y calcula de forma instantánea su proporción relativa de mercado mediante una barra de porcentaje dinámica de dos tonalidades cromáticas en contraste (Cian vs. Rosa).
* **¿Por qué se construyó?** Facilita la comparación directa de rendimiento acumulado entre industrias competidoras (ej. la resistencia histórica del *Vinyl* vs. la dominancia del *Streaming*).

### 6. Consola de Ecualización Avanzada (Web Audio API Rack)
* **¿Qué hace?** Un rack interactivo que simula un mezclador físico de audio con faders verticales neón. Utiliza el motor nativo **Web Audio API** del navegador para procesar música real en tiempo real:
  * **Filtro Bajo (Bass):** Controla un nodo `BiquadFilterNode` de tipo `lowshelf` (80 Hz).
  * **Filtro Medio (Mid):** Controla un nodo `peaking` centralizado a 1.2 kHz.
  * **Filtro Agudo (Treble):** Controla un nodo `highshelf` de alta frecuencia (5 kHz).
  * **Fader Maestro:** Conecta un nodo `GainNode` para el control fino del volumen de salida.
* **¿Por qué se construyó?** Genera consistencia interactiva con el tema del dashboard, permitiendo al analista "manipular las frecuencias físicas" de la misma manera que manipula las frecuencias de las variables estadísticas del ecosistema. Cuenta con protección contra contaminación acústica (el contexto arranca en *Mute* y en estado suspendido hasta la interacción física explícita del usuario).

---

## 🛠️ Stack Tecnológico Utilizado

* **Frontend Framework:** React 19 (Sintaxis estricta de componentes funcionales).
* **Language:** TypeScript 6 (Tipado estricto de eventos, referencias y estructuras).
* **Build Tool:** Vite 8 + Rolldown (Compilación de bundle optimizado ultra-rápida).
* **UI & Component Library:** Material UI (MUI v6) utilizando layouts responsivos mediante la nueva propiedad `size` de `<Grid>`.
* **Charts Engine:** Recharts 3 (Gráficos vectoriales SVG dinámicos y fluidos).
* **Backend de Datos:** Firebase Realtime Database (Conexión persistente mediante sockets).
* **Audio Engine:** Web Audio API nativo (Casada de filtros de audio interactivos en decibelios).

---

## 🎨 Principios de Diseño Visual e Interfaz (UI/UX)

El dashboard implementa una estética de diseño **Cyberpunk Analítico** orientada a pantallas oscuras:
* **Fondo Dinámico Texturizado:** Implementación mediante CSS de una malla de puntos industrial fija (`radial-gradient`) acoplada a dos focos de luz neón de ambiente (`#00E5FF` y `#FF007F`) que simulan profundidad tridimensional.
* **Aceleración por Hardware:** Los efectos interactivos de los faders, tarjetas estadísticas y el selector global de formatos implementan transiciones de estilo inercial orgánicas (`cubic-bezier(0.4, 0, 0.2, 1)`) y sombras de resplandor externo (`box-shadow`), distribuyendo el esfuerzo del renderizado directamente a la GPU de la computadora para evitar congelamientos de pantalla.

---

## 💻 Instalación y Configuración Local

Sigue estos pasos para levantar el entorno de desarrollo localmente:

1. **Clona el repositorio:**
   ```bash
   git clone [https://github.com/Exavier0154D/Music-Disc-Dashboard.git](https://github.com/Exavier0154D/Music-Disc-Dashboard.git)
   cd Music-Disc-Dashboard

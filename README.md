# 🎮 Tres en Raya (Tic Tac Toe)

Una implementación moderna y completa del clásico juego Tres en Raya, desarrollado como reto Full Stack con tecnologías de vanguardia. 

## 🎯 Objetivo

Este proyecto demuestra el desarrollo de una aplicación web completa que combina:
- **Frontend moderno**: Interfaz responsive y elegante con Next.js y React
- **Backend robusto**: API con Server Actions para manejo de datos
- **Persistencia de datos**: Almacenamiento de partidas y estadísticas en MongoDB
- **Lógica de juego avanzada**: IA inteligente y validación completa del estado del juego
- **Arquitectura escalable**: Contenedores Docker para desarrollo y despliegue

---

## ✨ Características principales

### 🎲 Funcionalidades del Juego
- **Juego clásico de Tres en Raya**: Experiencia de usuario intuitiva y responsive
- **IA inteligente**: Oponente artificial con estrategia avanzada
- **Reinicio automático**: El juego se reinicia automáticamente al finalizar cada partida

### 📊 Sistema de Estadísticas
- **Persistencia de partidas**: Todas las partidas se guardan en MongoDB
- **Ranking en tiempo real**: Estadísticas de jugador vs IA actualizadas constantemente
- **Historial completo**: Seguimiento de victorias, derrotas y empates

### 🎨 Interfaz y Experiencia
- **Diseño moderno**: Interfaz limpia y atractiva
- **Totalmente responsive**: Optimizada para dispositivos móviles y desktop
- **Retroalimentación visual**: Indicadores claros del estado del juego

---

## 🛠️ Tecnologías utilizadas

### Frontend
- **Next.js 15** - Framework React con App Router para renderizado híbrido
- **React 19** - Biblioteca para interfaces de usuario reactivas
- **TypeScript** - Tipado estático para mayor robustez del código
- **Tailwind CSS** - Framework CSS para diseño moderno y responsive

### Backend
- **Next.js Server Actions** - API integrada para comunicación frontend-backend
- **MongoDB** - Base de datos NoSQL para persistencia de datos
- **Mongoose** - ODM para modelado elegante de datos MongoDB

### Desarrollo y Despliegue
- **Docker & Docker Compose** - Contenedorización para desarrollo y despliegue
- **Jest** - Framework de testing para pruebas unitarias
- **ESLint** - Linter para mantener calidad de código

### Iconografía
- **React Icons** - Biblioteca de iconos para mejorar la interfaz

---

## 📁 Estructura del proyecto

- `src/app/` — Entrypoint Next.js, layout, página principal y estilos globales.
- `src/components/` — Componentes UI reutilizables (GameBoard, GameStats).
- `src/db/` — Conexión a MongoDB y modelos de datos (`Game`, `Stats`).
- `src/hooks/` — Hooks personalizados para estado de juego y estadísticas.
- `src/lib/` — Lógica de negocio, utilidades, tipos y acciones backend.
- `src/__tests__/` — Pruebas unitarias de la lógica principal.

---

## ⚡ Instalación y uso local

### 🐳 Opción recomendada: Con Docker (Más fácil)

La forma más sencilla de ejecutar el proyecto es usando Docker, ya que configura automáticamente todo el entorno.

**Paso 1:** Clona el repositorio
```bash
git clone https://github.com/jdds97/tic-tac-toe.git
cd tic-tac-toe
```

**Paso 2:** Inicia el entorno completo
```bash
# En Linux/Mac
./start.sh

# En Windows
./start.ps1
```

**Paso 3:** Accede a la aplicación
- Abre tu navegador en: http://localhost:3000
- MongoDB estará disponible en: mongodb://localhost:27017

**Para ejecutar comandos dentro del contenedor:**
```bash
# Entra al contenedor
docker compose exec -u node app bash

# Una vez dentro, puedes ejecutar:
npm run dev        # Modo desarrollo
npm test          # Ejecutar tests
npm run build     # Construir para producción
```

### 💻 Opción manual: Sin Docker

Si prefieres no usar Docker o quieres un control más granular:

**Paso 1:** Asegúrate de tener Node.js 18+ y MongoDB instalados

**Paso 2:** Instala las dependencias
```bash
npm install
```

**Paso 3:** Configura la base de datos
Crea un archivo `.env.local` en la raíz del proyecto:
```env
MONGODB_URI=mongodb://localhost:27017/tic-tac-toe
```

**Paso 4:** Inicia la aplicación
```bash
npm run dev
```

**Paso 5:** Accede a la aplicación
- Abre tu navegador en: http://localhost:3000

---

## 🧪 Testing y calidad del código

### Ejecutar tests
```bash
# Ejecutar todos los tests una vez
npm test

# Ejecutar tests en modo watch (reejecutar al cambiar archivos)
npm test:watch
```

### Cobertura de tests
- **Lógica de juego**: Tests completos para validación de victorias, empates y movimientos
- **IA del juego**: Verificación de estrategias de la inteligencia artificial
- **Utilidades**: Tests para validación de tableros y movimientos
- **Total**: 18 tests unitarios que cubren la lógica principal

Los tests principales están ubicados en `src/__tests__/gameLogic.test.ts`.

---

## 📝 Buenas prácticas y desarrollo
- El histórico de Git refleja la toma de decisiones y evolución del proyecto.
- El código está documentado y sigue buenas prácticas de TypeScript y React.
- El backend valida todos los inputs y es robusto ante datos inválidos.
- Implementadas server actions más simples y menos código con interacción directa con la bbdd
- Se han utilizado contenedores Docker para aislar dependencias y facilitar la colaboración entre diferentes equipos de desarrollo.

> Proyecto realizado como parte del proceso de selección Full Stack Developer en Shakers.


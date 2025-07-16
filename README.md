# Talent Challenge: Tres en Raya (Tic Tac Toe)

Juego clásico de Tres en Raya desarrollado como reto Full Stack . Incluye frontend con Next.js, backend con API(Server Actions), persistencia de partidas y estadísticas en MongoDB, y lógica de juego robusta.

---

## 🚀 Funcionalidades principales
- Juega partidas de Tres en Raya (Tic Tac Toe) en web.
- Persistencia de partidas y estadísticas en MongoDB.
- Ranking de jugador e IA en tiempo real.
- Interfaz responsive y moderna.
- Lógica de validación robusta y testada.
- El juego se reinicia solo

---

## 🛠️ Tecnologías utilizadas
- **Frontend & Backend:** Next.js (App Router), React, TypeScript
- **Base de datos:** MongoDB
- **Testing:** Jest
- **Linting:** ESLint
- **Iconos** React icons
- **Contenedores:** Docker, Docker Compose

---

## 📁 Estructura del proyecto

- `src/app/` — Entrypoint Next.js, layout, página principal y estilos globales.
- `src/components/` — Componentes UI reutilizables (GameBoard, GameStats).
- `src/db/` — Conexión a MongoDB y modelos de datos (`Game`, `Stats`).
- `src/hooks/` — Hooks personalizados para estado de juego y estadísticas.
- `src/lib/` — Lógica de negocio, utilidades, tipos y acciones backend.
- `src/__tests__/` — Pruebas unitarias de la lógica principal.

---

## ⚡ Instalación y ejecución

### Opción recomendada: Docker

1. Clona el repositorio y entra en la carpeta:
   ```bash
   git clone https://github.com/jdds97/tic-tac-toe.git
   cd tic-tac-toe
   ```
2. Arranca el entorno de desarrollo:
   ```bash
   ./start.sh
   ```
   O en Windows:
   ```powershell
   ./start.ps1
   ```
   Esto levantará la app y MongoDB usando Docker Compose. Las dependencias se instalan automáticamente dentro del contenedor.

   **Importante:** Para ejecutar comandos como `npm run dev`, `npm test`, etc., hazlo dentro del contenedor:
   ```bash
   docker compose exec -u node app bash
   # Ya dentro del contenedor
   npm run dev
   ```

### Opción manual (sin Docker)

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Crea un archivo `.env.local` con la URI de tu base de datos MongoDB:
   ```env
   MONGODB_URI=mongodb://localhost:27017/tic-tac-toe
   ```
3. Inicia el entorno de desarrollo:
   ```bash
   npm run dev
   ```

---

## 🧪 Testing
- Ejecuta los tests unitarios:
  ```bash
  npm test
  ```
- Los tests principales están en `src/__tests__/gameLogic.test.ts`.

---

## 📝 Buenas prácticas y desarrollo
- El histórico de Git refleja la toma de decisiones y evolución del proyecto.
- El código está documentado y sigue buenas prácticas de TypeScript y React.
- El backend valida todos los inputs y es robusto ante datos inválidos.
- Implementadas server actions más simples y menos código con interacción directa con la bbdd
- Se han utilizado contenedores Docker para aislar dependencias y facilitar la colaboración entre diferentes equipos de desarrollo.


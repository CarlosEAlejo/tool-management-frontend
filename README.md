# Tool Management Frontend

Frontend administrativo para la gestion de herramientas. Esta aplicacion usa React + Vite y consume la API Go del proyecto de backend.

## Requisitos

- Node `24.13.0`
- Backend disponible en `http://localhost:8000`

## Desarrollo local

1. Levanta el backend desde `tool-management-backend`.
2. En este directorio instala dependencias si hace falta con `npm install`.
3. Inicia el frontend con `npm start`.
4. Abre `http://localhost:5173`.

## API en desarrollo

El frontend usa proxy same-origin en Vite:

- Navegador: `http://localhost:5173`
- API desde el frontend: `/api/*`
- Proxy interno hacia: `http://localhost:8000/*`

Esto evita problemas con cookies y CSRF en desarrollo. No abras la app con `127.0.0.1:5173`; usa `localhost:5173`.

La variable local actual en `.env` es:

```env
VITE_API_URL="/api"
```

Si en otro entorno necesitas apuntar a una API distinta, puedes cambiar `VITE_API_URL`.

## Autenticacion

El flujo actual usa:

- `accessToken` en memoria del frontend
- `refreshToken` en cookie `HttpOnly`
- token CSRF en cookie legible por el frontend
- cabecera `X-CSRF-Token` para `refresh` y `logout`

Comportamiento esperado:

- Sin sesion, la app abre en `/login`
- Tras iniciar sesion, se permite acceder al panel y a rutas protegidas
- Tras recargar, la sesion se restaura automaticamente si las cookies siguen vigentes
- Tras cerrar sesion, las rutas protegidas vuelven a redirigir a `/login`

## Scripts

- `npm start`: inicia Vite en desarrollo
- `npm run build`: genera el build de produccion
- `npm run test:run`: ejecuta la suite de Vitest
- `npm test`: ejecuta Vitest en modo interactivo
- `npm run typecheck`: valida TypeScript sin emitir archivos

## Verificacion recomendada

Antes de dar cambios por cerrados:

- `npm run test:run`
- `npm run build`
- comprobar en navegador `http://localhost:5173`

## Estructura relevante

- `src/app`: composicion principal de la app y rutas
- `src/features/auth`: login, registro, contexto de autenticacion y guardas
- `src/features/tools`: pantalla principal de herramientas
- `src/services/api`: cliente HTTP y servicios de API
- `vite.config.ts`: configuracion de Vite y proxy `/api`

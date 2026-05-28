# PROJECT_STATE

Este archivo resume el estado actual del proyecto para reducir dependencia del contexto del chat.

Debe actualizarse al terminar cada milestone o feature importante.

## Estado actual

Milestone 0 completado.

El proyecto tiene una aplicación mínima que abre en navegador, carga un canvas, ejecuta un game loop con `requestAnimationFrame`, limpia la pantalla cada frame y dibuja un objeto simple de prueba.

Todavía no hay ECS, gameplay, mapa, combate, input jugable, UI compleja, conjuros ni assets externos.

## Sistemas existentes

Ninguno.

## Componentes existentes

Ninguno.

## Commands existentes

Ninguno.

## Events existentes

Ninguno.

## Contenido existente

Ninguno.

## Archivos de aplicación existentes

- `index.html`
- `style.css`
- `src/app/main.js`

## Próximo objetivo

Milestone 1: Movimiento y colisión.

Crear:

- ECS mínimo.
- Entidad jugador.
- Componentes `Position`, `Velocity`, `Renderable`, `Collider`, `MovementStats`.
- Tilemap simple.
- Colisión contra paredes.
- Cámara básica si hace falta.

## Riesgos actuales

- Convertir `src/app/main.js` en un archivo demasiado grande.
- Empezar por features complejas antes del core.
- Migrar código viejo sin revisar arquitectura.
- Crear lógica de juego dentro de UI o render.
- Pedir a la IA implementaciones grandes sin scope.
- Intentar hacer multiplayer o servidor demasiado pronto.

## Decisiones recientes

- Milestone 0 fue implementado sin ECS.
- Milestone 0 fue implementado sin input jugable.
- Milestone 0 fue implementado sin mapa, combate, UI compleja, conjuros ni assets externos.
- ECS será la fuente de verdad para entidades dinámicas.
- El combate será en tiempo real pausado, no por turnos clásicos.
- No se usará CA como defensa central.
- Armadura mitigará daño.
- Destreza no dará evasión pasiva universal.
- Descansos y rituales largos serán time-skips.
- No habrá multiplayer en la demo inicial.

# PROJECT_STATE

Este archivo resume el estado actual del proyecto para reducir dependencia del contexto del chat.

Debe actualizarse al terminar cada milestone o feature importante.

## Estado actual

Milestone 1 completado.

El proyecto tiene una aplicación mínima que abre en navegador, carga un canvas, ejecuta un game loop con `requestAnimationFrame`, dibuja un tilemap fijo simple y permite mover un jugador como entidad ECS.

El jugador se controla con teclado, se mueve usando `deltaSeconds`, no atraviesa paredes del tilemap y no sale del mapa porque los bordes son tiles sólidos.

Se aplicó un refactor mínimo pre-Milestone 2: la creación inicial del jugador fue extraída desde `src/app/main.js` hacia `src/game/createPlayer.js` para evitar que `main.js` acumule composición interna de entidades.

Todavía no hay combate, vida/daño, enemigos, conjuros, menú táctico, inventario, cámara compleja, assets externos, guardado, multiplayer ni servidor.

## Sistemas existentes

- `playerControlSystem`: convierte movement intent en velocidad para entidades `PlayerControlled`.
- `movementSystem`: aplica movimiento con `deltaSeconds` y colisión básica contra tilemap.

## Componentes existentes

- `Position`
- `Velocity`
- `Renderable`
- `Collider`
- `MovementStats`
- `PlayerControlled`

## Commands existentes

Ninguno.

## Events existentes

Ninguno.

## Contenido existente

Ninguno.

## Mundo existente

- Tilemap fijo mínimo con tiles de piso y pared.
- Helper básico de colisión contra tiles sólidos.

## Input existente

- Input de teclado mínimo para movimiento con WASD y flechas.
- Input produce movement intent.
- Input no modifica ECS ni componentes.

## Render existente

- Canvas renderer mínimo.
- Dibuja tilemap.
- Dibuja entidades con `Position` + `Renderable`.
- Render no modifica estado de juego.

## Factories/setup existentes

- `createPlayer`: crea la entidad jugador y compone sus componentes iniciales.

## Archivos de aplicación existentes

- `index.html`
- `style.css`
- `src/app/main.js`
- `src/ecs/world.js`
- `src/domain/components.js`
- `src/game/createPlayer.js`
- `src/input/keyboardInput.js`
- `src/world/tilemap.js`
- `src/simulation/playerControlSystem.js`
- `src/simulation/movementSystem.js`
- `src/render/canvasRenderer.js`

## Próximo objetivo

Milestone 2: Vida, daño y enemigo básico.

Crear:

- `Health`.
- `Creature`.
- `Faction`.
- Enemigo quieto.
- Ataque de prueba.
- Muerte de entidad.

## Riesgos actuales

- Sobrecargar `src/game/createPlayer.js` con lógica que debería vivir en content/domain si el jugador crece demasiado.
- Sobrecargar el ECS mínimo antes de necesitar command buffer o event bus.
- Crear lógica de combate antes de cerrar bien vida/daño.
- Crear lógica de juego dentro de input o render.
- Pedir a la IA implementaciones grandes sin scope.
- Intentar hacer multiplayer o servidor demasiado pronto.

## Decisiones recientes

- Se extrajo `createPlayer` desde `src/app/main.js` hacia `src/game/createPlayer.js`.
- `src/app/main.js` queda como composition root de canvas/context, world, input, renderer, frame loop, sistemas y render.
- Milestone 1 introdujo ECS mínimo.
- El jugador ya es una entidad ECS dinámica.
- El tilemap base vive fuera del ECS.
- Input produce movement intent y no modifica ECS.
- Simulation actualiza ECS y resuelve movimiento/colisión.
- Render dibuja el estado sin modificar componentes.
- No se crearon commands ni events todavía.
- No se creó command buffer ni event bus todavía.
- No se implementó combate, vida/daño, enemigos, conjuros, UI compleja ni assets externos.
- ECS será la fuente de verdad para entidades dinámicas.
- El combate será en tiempo real pausado, no por turnos clásicos.
- No se usará CA como defensa central.
- Armadura mitigará daño.
- Destreza no dará evasión pasiva universal.
- Descansos y rituales largos serán time-skips.
- No habrá multiplayer en la demo inicial.

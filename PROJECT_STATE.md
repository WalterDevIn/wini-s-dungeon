# PROJECT_STATE

Este archivo resume el estado actual del proyecto para reducir dependencia del contexto del chat.

Debe actualizarse al terminar cada milestone o feature importante.

## Estado actual

Milestone 2 completado.

El proyecto tiene una aplicación mínima que abre en navegador, carga un canvas, ejecuta un game loop con `requestAnimationFrame`, dibuja un tilemap fijo simple y permite mover un jugador como entidad ECS.

El jugador se controla con teclado, se mueve usando `deltaSeconds`, no atraviesa paredes del tilemap y no sale del mapa porque los bordes son tiles sólidos.

El juego ahora tiene vida, daño mínimo, facciones, criatura jugador, enemigo quieto y muerte/remoción de entidad. El jugador puede usar un ataque de prueba con `Space` para dañar al enemigo si está cerca; después de suficientes golpes, el enemigo muere y desaparece.

Se aplicó un refactor mínimo pre-Milestone 2: la creación inicial del jugador fue extraída desde `src/app/main.js` hacia `src/game/createPlayer.js` para evitar que `main.js` acumule composición interna de entidades.

Se aplicó un refactor de legibilidad ECS: `src/ecs/world.js` ahora expone `addComponents(...)`, un helper genérico para agregar varios componentes a una entidad sin cambiar el modelo ECS ni crear arquitectura futura.

Todavía no hay combate melee completo, cooldowns, economía de acciones, IA enemiga, ataque enemigo, conjuros, menú táctico, inventario, cámara compleja, assets externos, guardado, multiplayer ni servidor.

## Sistemas existentes

- `playerControlSystem`: convierte movement intent en velocidad para entidades `PlayerControlled`.
- `movementSystem`: aplica movimiento con `deltaSeconds` y colisión básica contra tilemap.
- `testAttackSystem`: aplica daño fijo de prueba a una criatura de facción enemiga cercana cuando recibe un intent de ataque de prueba.
- `deathSystem`: remueve entidades con `Health.current <= 0`.

## Componentes existentes

- `Position`
- `Velocity`
- `Renderable`
- `Collider`
- `MovementStats`
- `PlayerControlled`
- `Health`
- `Creature`
- `Faction`

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
- Input produce test attack intent consumible con `Space`.
- Input no modifica ECS ni componentes.
- Input no aplica daño.

## Render existente

- Canvas renderer mínimo.
- Dibuja tilemap.
- Dibuja entidades con `Position` + `Renderable`.
- Render no modifica estado de juego.

## ECS existente

- `createWorld`: crea el contenedor ECS mínimo.
- `createEntity`: crea una entidad.
- `removeEntity`: remueve una entidad y sus componentes.
- `addComponent`: agrega un componente a una entidad.
- `addComponents`: agrega varios componentes a una entidad usando pares `[componentType, componentData]`.
- `getComponent`: obtiene un componente de una entidad.
- `queryEntities`: consulta entidades por componentes.

## Factories/setup existentes

- `createPlayer`: crea la entidad jugador y compone sus componentes iniciales usando `addComponents(...)`.
- `createEnemy`: crea un enemigo quieto con `Position`, `Renderable`, `Collider`, `Health`, `Creature` y `Faction`.

## Archivos de aplicación existentes

- `index.html`
- `style.css`
- `src/app/main.js`
- `src/ecs/world.js`
- `src/domain/components.js`
- `src/game/createPlayer.js`
- `src/game/createEnemy.js`
- `src/input/keyboardInput.js`
- `src/world/tilemap.js`
- `src/simulation/playerControlSystem.js`
- `src/simulation/movementSystem.js`
- `src/simulation/testAttackSystem.js`
- `src/simulation/deathSystem.js`
- `src/render/canvasRenderer.js`

## Próximo objetivo

Milestone 3: Combate melee en tiempo real.

Crear:

- `ActionEconomy`.
- Cooldown de ataque.
- `AttackProfile`.
- `DefenseProfile`.
- `DamageReduction`.
- Hitbox o alcance melee.
- Feedback mínimo.

## Riesgos actuales

- Confundir `testAttackSystem` con combate final. Es un sistema temporal de prueba para Milestone 2.
- Crear combate melee completo antes de diseñar economía de acciones y cooldowns.
- Sobrecargar `src/game/createPlayer.js` o `src/game/createEnemy.js` con lógica que debería vivir en content/domain si las entidades crecen demasiado.
- Sobrecargar el ECS mínimo antes de necesitar command buffer o event bus.
- Crear lógica de juego dentro de input o render.
- Pedir a la IA implementaciones grandes sin scope.
- Intentar hacer multiplayer o servidor demasiado pronto.

## Decisiones recientes

- Milestone 2 introdujo `Health`, `Creature` y `Faction`.
- Milestone 2 agregó un enemigo quieto como entidad ECS.
- Milestone 2 agregó daño mínimo mediante `testAttackSystem`, sin crear combate melee completo.
- Milestone 2 agregó muerte/remoción de entidad mediante `deathSystem` y `removeEntity`.
- Input produce un intent consumible de ataque de prueba con `Space`, pero no aplica daño.
- Simulation aplica daño y muerte.
- Render sigue dibujando entidades con `Position` + `Renderable` sin modificar componentes.
- No se crearon commands ni events todavía.
- No se creó command buffer ni event bus todavía.
- No se implementó IA enemiga, ataque enemigo, cooldowns, action economy, UI compleja ni assets externos.
- Se agregó `addComponents(...)` a `src/ecs/world.js` como helper genérico de legibilidad ECS.
- `createPlayer` ahora usa `addComponents(...)` para declarar sus componentes iniciales de forma más compacta.
- Se extrajo `createPlayer` desde `src/app/main.js` hacia `src/game/createPlayer.js`.
- `src/app/main.js` queda como composition root de canvas/context, world, input, renderer, frame loop, sistemas y render.
- ECS será la fuente de verdad para entidades dinámicas.
- El combate será en tiempo real pausado, no por turnos clásicos.
- No se usará CA como defensa central.
- Armadura mitigará daño.
- Destreza no dará evasión pasiva universal.
- Descansos y rituales largos serán time-skips.
- No habrá multiplayer en la demo inicial.

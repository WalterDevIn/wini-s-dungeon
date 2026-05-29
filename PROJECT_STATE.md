# PROJECT_STATE

Este archivo resume el estado actual del proyecto para reducir dependencia del contexto del chat.

Debe actualizarse al terminar cada milestone o feature importante.

## Estado actual

Milestone 2 completado.

El proyecto tiene una aplicación mínima que abre en navegador, carga un canvas, ejecuta un game loop con `requestAnimationFrame`, dibuja un tilemap fijo simple y permite mover un jugador como entidad ECS.

El jugador se controla con teclado, se mueve usando `deltaSeconds`, no atraviesa paredes del tilemap y no sale del mapa porque los bordes son tiles sólidos.

El juego ahora tiene vida, daño mínimo, facciones, criatura jugador, enemigo quieto y muerte/remoción de entidad. El jugador puede usar un ataque básico temporal con `Space` para dañar al enemigo si está cerca; después de suficientes golpes, el enemigo muere y desaparece.

Se aplicó un refactor de render y colisión pre-Milestone 3: el dibujo de mapa y entidades fue separado desde `canvasRenderer.js` hacia `drawMap.js` y `drawEntities.js`, y la resolución de movimiento contra tiles fue extraída desde `movementSystem.js` hacia `simulation/helpers/movementCollision.js`.

Se aplicó un cambio visual pre-Milestone 3: el renderer dibuja una estética roguelike mínima con tiles de pared como `#`, piso con puntos tenues, grilla translúcida y entidades como glyphs sobre canvas. Este cambio no modifica simulation, input, ECS, world, daño, movimiento ni colisión.

Se aplicó un refactor arquitectónico post-Milestone 2: la simulación del frame ahora se orquesta desde `runSimulationStep(...)`, `src/app/main.js` ya no conoce el orden interno de los sistemas de simulation, y las reglas puras de daño/rango fueron extraídas a `src/domain/rules/`.

Se aplicó un refactor mínimo pre-Milestone 2: la creación inicial del jugador fue extraída desde `src/app/main.js` hacia `src/game/createPlayer.js` para evitar que `main.js` acumule composición interna de entidades.

Se aplicó un refactor de legibilidad ECS: `src/ecs/world.js` ahora expone `addComponents(...)`, un helper genérico para agregar varios componentes a una entidad sin cambiar el modelo ECS ni crear arquitectura futura.

Todavía no hay combate melee completo, cooldowns, economía de acciones, IA enemiga, ataque enemigo, conjuros, menú táctico, inventario, cámara compleja, assets externos, guardado, multiplayer ni servidor.

## Sistemas existentes

- `playerControlSystem`: convierte movement intent en velocidad para entidades `PlayerControlled`.
- `movementSystem`: aplica movimiento con `deltaSeconds` y delega la resolución contra tiles a `movementCollision`.
- `basicAttackSystem`: aplica daño fijo básico a una criatura de facción enemiga cercana cuando recibe un intent de ataque básico.
- `deathSystem`: remueve entidades con `Health.current <= 0`.
- `runSimulationStep`: orquesta el orden de sistemas de simulation para un frame.

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

## Reglas puras existentes

- `damageRules`: contiene regla pura mínima para aplicar daño a `Health`.
- `attackRules`: contiene regla pura mínima para calcular rango de ataque entre colliders.

## Contenido existente

Ninguno.

## Mundo existente

- Tilemap fijo mínimo con tiles de piso y pared.
- Helper básico de colisión contra tiles sólidos.

## Input existente

- Input de teclado mínimo para movimiento con WASD y flechas.
- Input produce movement intent.
- Input produce basic attack intent consumible con `Space`.
- Input no modifica ECS ni componentes.
- Input no aplica daño.

## Render existente

- Canvas renderer mínimo.
- `canvasRenderer` coordina resize, limpieza de frame, dibujo de mapa y dibujo de entidades.
- `drawMap` dibuja tilemap con estética roguelike mínima.
- `drawEntities` dibuja entidades con `Position` + `Renderable`.
- Dibuja paredes como `#`.
- Dibuja piso con puntos tenues y grilla translúcida.
- Soporta `Renderable` con `shape: "glyph"` y fallback rectangular.
- Render no modifica estado de juego.

## ECS existente

- `createWorld`: crea el contenedor ECS mínimo.
- `createEntity`: crea una entidad.
- `removeEntity`: remueve una entidad y sus componentes.
- `addComponent`: agrega un componente a una entidad.
- `addComponents`: agrega varios componentes a una entidad usando pares `[componentType, componentData]`.
- `getComponent`: obtiene un componente de una entidad.
- `queryEntities`: consulta entidades por componentes.

## Simulation helpers existentes

- `movementCollision`: resuelve movimiento por eje contra tilemap usando colisión de tiles.

## Factories/setup existentes

- `createPlayer`: crea la entidad jugador y compone sus componentes iniciales usando `addComponents(...)`. Su representación visual actual es el glyph `@`.
- `createEnemy`: crea un enemigo quieto con `Position`, `Renderable`, `Collider`, `Health`, `Creature` y `Faction`. Su representación visual actual es el glyph `e`.

## Archivos de aplicación existentes

- `index.html`
- `style.css`
- `src/app/main.js`
- `src/ecs/world.js`
- `src/domain/components.js`
- `src/domain/rules/damageRules.js`
- `src/domain/rules/attackRules.js`
- `src/game/createPlayer.js`
- `src/game/createEnemy.js`
- `src/input/keyboardInput.js`
- `src/world/tilemap.js`
- `src/simulation/runSimulationStep.js`
- `src/simulation/playerControlSystem.js`
- `src/simulation/movementSystem.js`
- `src/simulation/helpers/movementCollision.js`
- `src/simulation/basicAttackSystem.js`
- `src/simulation/deathSystem.js`
- `src/render/canvasRenderer.js`
- `src/render/drawMap.js`
- `src/render/drawEntities.js`

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

- Confundir `basicAttackSystem` con combate final. Sigue siendo un sistema básico pre-Milestone 3.
- Crear combate melee completo antes de diseñar economía de acciones y cooldowns.
- Sobrecargar `runSimulationStep` con lógica que debería vivir en sistemas específicos.
- Convertir `Renderable` en una bolsa de datos visuales demasiado amplia sin diseñar renderer/content.
- Sobrecargar `drawEntities` si se agregan sprites, animaciones o capas sin scope.
- Sobrecargar `movementCollision` si se intenta resolver ahí colisiones generales de proyectiles/criaturas/puertas antes de diseñar `collisionSystem`.
- Sobrecargar `src/game/createPlayer.js` o `src/game/createEnemy.js` con lógica que debería vivir en content/domain si las entidades crecen demasiado.
- Sobrecargar el ECS mínimo antes de necesitar command buffer o event bus.
- Crear lógica de juego dentro de input o render.
- Pedir a la IA implementaciones grandes sin scope.
- Intentar hacer multiplayer o servidor demasiado pronto.

## Decisiones recientes

- Se dividió el render de canvas en `canvasRenderer`, `drawMap` y `drawEntities`.
- Se extrajo la resolución de movimiento contra tiles a `simulation/helpers/movementCollision.js`.
- `movementSystem` queda como sistema ECS de movimiento y delega detalles de colisión.
- `runSimulationStep.js` se conserva en `simulation/`, alineado con la arquitectura objetivo.
- No se creó `collisionSystem` todavía; se reservó para cuando existan colisiones dinámicas más generales.
- Se aplicó estética roguelike mínima sin tocar simulation/input/ECS/world/rules.
- `Renderable` ahora puede representar glyphs visuales mediante `shape: "glyph"`, `glyph` y `fontSize`.
- El jugador se dibuja como `@`.
- El enemigo se dibuja como `e`.
- El tilemap se dibuja con paredes `#`, puntos tenues de piso y grilla translúcida.
- Se eliminó `testAttackSystem` para evitar código muerto/confuso antes de Milestone 3.
- Se agregó `basicAttackSystem` como sistema básico de ataque pre-Milestone 3.
- Se agregó `runSimulationStep(...)` para centralizar el orden de sistemas de simulation fuera de `src/app/main.js`.
- Se extrajeron reglas puras de daño y rango a `src/domain/rules/`.
- Milestone 2 introdujo `Health`, `Creature` y `Faction`.
- Milestone 2 agregó un enemigo quieto como entidad ECS.
- Milestone 2 agregó daño mínimo, sin crear combate melee completo.
- Milestone 2 agregó muerte/remoción de entidad mediante `deathSystem` y `removeEntity`.
- Input produce un intent consumible de ataque básico con `Space`, pero no aplica daño.
- Simulation aplica daño y muerte.
- Render sigue dibujando entidades con `Position` + `Renderable` sin modificar componentes.
- No se crearon commands ni events todavía.
- No se creó command buffer ni event bus todavía.
- No se implementó IA enemiga, ataque enemigo, cooldowns, action economy, UI compleja ni assets externos.
- Se agregó `addComponents(...)` a `src/ecs/world.js` como helper genérico de legibilidad ECS.
- `createPlayer` ahora usa `addComponents(...)` para declarar sus componentes iniciales de forma más compacta.
- Se extrajo `createPlayer` desde `src/app/main.js` hacia `src/game/createPlayer.js`.
- `src/app/main.js` queda como composition root de canvas/context, world, input, renderer, frame loop y render.
- ECS será la fuente de verdad para entidades dinámicas.
- El combate será en tiempo real pausado, no por turnos clásicos.
- No se usará CA como defensa central.
- Armadura mitigará daño.
- Destreza no dará evasión pasiva universal.
- Descansos y rituales largos serán time-skips.
- No habrá multiplayer en la demo inicial.

# PROJECT_STATE

Este archivo resume el estado actual del proyecto para reducir dependencia del contexto del chat.

Debe actualizarse al terminar cada milestone o feature importante.

## Estado actual

Milestone 3.5 completado.

El proyecto tiene una aplicación mínima que abre en navegador, carga un canvas, ejecuta un game loop con `requestAnimationFrame`, dibuja un tilemap fijo simple y permite mover un jugador como entidad ECS.

El jugador se controla con teclado, se mueve usando `deltaSeconds`, no atraviesa paredes del tilemap y no sale del mapa porque los bordes son tiles sólidos.

El juego ahora tiene vida, daño, facciones, criatura jugador, enemigo quieto, muerte/remoción de entidad y combate melee mínimo con fases. El jugador puede usar `Space` para iniciar un ataque melee; el ataque entra en `windup`, luego resuelve impacto contra el estado actual del mundo, y después entra en `recovery`.

Regla actual de ataque melee: un ataque confirmado consume la acción aunque no impacte. El daño solo se aplica si, al terminar el `windup`, existe un objetivo enemigo válido dentro del alcance.

Se aplicó Milestone 3.5: `ActionEconomy` dejó de ser solo un cooldown numérico y ahora representa acción actual, fase, tiempo restante y ataque pendiente. `AttackProfile` separa `windupSeconds` y `recoverySeconds`. `meleeCombatSystem` ya no aplica daño instantáneo al recibir input; inicia la acción, resuelve el impacto después del `windup` y libera al actor después del `recovery`.

Se aplicó Milestone 3: se agregaron `ActionEconomy`, `AttackProfile`, `DefenseProfile` y `DamageReduction`; se agregó combate melee mínimo; se reemplazó el ataque básico de prueba por `meleeCombatSystem`; y el daño pasa por reducción plana.

Se aplicó limpieza post-Milestone 3: `src/app/main.js` usa `consumeAttackIntent()` y pasa `attackIntent` a `runSimulationStep`; `keyboardInput.js` no expone alias temporales; `runSimulationStep` no acepta nombres temporales; y `src/simulation/basicAttackSystem.js` fue eliminado.

Se aplicó un refactor de render y colisión pre-Milestone 3: el dibujo de mapa y entidades fue separado desde `canvasRenderer.js` hacia `drawMap.js` y `drawEntities.js`, y la resolución de movimiento contra tiles fue extraída desde `movementSystem.js` hacia `simulation/helpers/movementCollision.js`.

Se aplicó un cambio visual pre-Milestone 3: el renderer dibuja una estética roguelike mínima con tiles de pared como `#`, piso con puntos tenues, grilla translúcida y entidades como glyphs sobre canvas.

Se aplicó un refactor arquitectónico post-Milestone 2: la simulación del frame ahora se orquesta desde `runSimulationStep(...)`, `src/app/main.js` no conoce el orden interno detallado de render ni contiene reglas de simulación, y las reglas puras de daño/rango viven en `src/domain/rules/`.

Todavía no hay IA enemiga, ataque enemigo, conjuros, menú táctico, inventario, cámara compleja, assets externos, guardado, multiplayer ni servidor.

## Sistemas existentes

- `playerControlSystem`: convierte movement intent en velocidad para entidades `PlayerControlled`.
- `movementSystem`: aplica movimiento con `deltaSeconds` y delega la resolución contra tiles a `movementCollision`.
- `actionEconomySystem`: reduce el tiempo restante de acciones en curso.
- `meleeCombatSystem`: procesa intent de ataque melee del jugador, inicia `windup`, resuelve impacto al terminar el `windup`, aplica daño mitigado si hay objetivo válido y gestiona `recovery`.
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
- `ActionEconomy`
- `AttackProfile`
- `DefenseProfile`
- `DamageReduction`

## Commands existentes

Ninguno.

## Events existentes

Ninguno.

## Reglas puras existentes

- `damageRules`: contiene cálculo de daño mitigado y aplicación de daño a `Health`.
- `attackRules`: contiene regla pura mínima para calcular rango de ataque entre colliders.

## Contenido existente

Ninguno.

## Mundo existente

- Tilemap fijo mínimo con tiles de piso y pared.
- Helper básico de colisión contra tiles sólidos.

## Input existente

- Input de teclado mínimo para movimiento con WASD y flechas.
- Input produce movement intent.
- Input produce attack intent consumible con `Space`.
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
- `meleeHitDetection`: busca el primer objetivo melee válido para un atacante y un perfil de ataque o ataque pendiente.

## Factories/setup existentes

- `createPlayer`: crea la entidad jugador y compone sus componentes iniciales usando `addComponents(...)`. Tiene `ActionEconomy`, `AttackProfile`, `DefenseProfile` y `DamageReduction`.
- `createEnemy`: crea un enemigo quieto con `Position`, `Renderable`, `Collider`, `Health`, `Creature`, `Faction`, `DefenseProfile` y `DamageReduction`.

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
- `src/simulation/helpers/meleeHitDetection.js`
- `src/simulation/actionEconomySystem.js`
- `src/simulation/meleeCombatSystem.js`
- `src/simulation/deathSystem.js`
- `src/render/canvasRenderer.js`
- `src/render/drawMap.js`
- `src/render/drawEntities.js`

## Próximo objetivo

Milestone 4: IA simple.

Crear:

- `AIControlled`.
- Sistema de persecución simple.
- Ataque enemigo usando la misma estructura de acción melee con `windup` y `recovery`.
- Faction filtering.

## Riesgos actuales

- `meleeCombatSystem` todavía está centrado en el jugador porque busca atacantes con `PlayerControlled`; Milestone 4 debe generalizarlo sin duplicar lógica de combate.
- El ataque ya tiene fases, pero no hay feedback visual de `windup` o `recovery`; si se vuelve ilegible, debe tratarse en un scope separado.
- Sobrecargar `meleeCombatSystem` con IA, efectos, knockback o feedback visual sin scope.
- Sobrecargar `runSimulationStep` con lógica que debería vivir en sistemas específicos.
- Convertir `Renderable` en una bolsa de datos visuales demasiado amplia sin diseñar renderer/content.
- Sobrecargar `movementCollision` si se intenta resolver ahí colisiones generales de proyectiles/criaturas/puertas antes de diseñar `collisionSystem`.
- Sobrecargar el ECS mínimo antes de necesitar command buffer o event bus.
- Crear lógica de juego dentro de input o render.
- Pedir a la IA implementaciones grandes sin scope.
- Intentar hacer multiplayer o servidor demasiado pronto.

## Decisiones recientes

- Milestone 3.5 introdujo `windup` y `recovery` para ataques melee.
- Un ataque melee confirmado consume la acción aunque no impacte.
- El daño de melee se resuelve contra el estado actual del mundo al terminar el `windup`, no al presionar la tecla.
- `ActionEconomy` ahora modela `currentAction`, `phase`, `timeRemaining` y `pendingAttack`.
- `AttackProfile` ahora usa `windupSeconds` y `recoverySeconds` en lugar de `cooldownSeconds`.
- Se eliminó `src/simulation/basicAttackSystem.js`.
- Se limpió el flujo activo post-Milestone 3: `main.js` usa `attackIntent`, `runSimulationStep` recibe `attackIntent`, e input expone solo `consumeAttackIntent`.
- Milestone 3 introdujo combate melee mínimo con cooldown.
- Se agregaron `ActionEconomy`, `AttackProfile`, `DefenseProfile` y `DamageReduction`.
- Se agregó `actionEconomySystem` para reducir timers de acción por frame.
- Se agregó `meleeCombatSystem` para procesar ataques melee del jugador.
- Se agregó `meleeHitDetection` como helper de detección melee.
- `DamageReduction` mitiga daño con reducción plana.
- Input produce un intent consumible de ataque con `Space`, pero no aplica daño.
- No se crearon commands ni events todavía.
- No se creó command buffer ni event bus todavía.
- No se implementó IA enemiga, ataque enemigo, UI compleja ni assets externos.
- Se dividió el render de canvas en `canvasRenderer`, `drawMap` y `drawEntities`.
- Se extrajo la resolución de movimiento contra tiles a `simulation/helpers/movementCollision.js`.
- `movementSystem` queda como sistema ECS de movimiento y delega detalles de colisión.
- `runSimulationStep.js` se conserva en `simulation/`, alineado con la arquitectura objetivo.
- No se creó `collisionSystem` todavía; se reservó para cuando existan colisiones dinámicas más generales.
- ECS será la fuente de verdad para entidades dinámicas.
- El combate será en tiempo real pausado, no por turnos clásicos.
- No se usará CA como defensa central.
- Armadura mitigará daño.
- Destreza no dará evasión pasiva universal.
- Descansos y rituales largos serán time-skips.
- No habrá multiplayer en la demo inicial.

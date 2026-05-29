# PROJECT_STATE

Este archivo resume el estado actual del proyecto para reducir dependencia del contexto del chat.

Debe actualizarse al terminar cada milestone o feature importante.

## Estado actual

Milestone 4 completado.

El proyecto tiene una aplicación mínima que abre en navegador, carga un canvas, ejecuta un game loop con `requestAnimationFrame`, dibuja un tilemap fijo simple y permite mover un jugador como entidad ECS.

El jugador se controla con teclado, se mueve usando `deltaSeconds`, no atraviesa paredes del tilemap y no sale del mapa porque los bordes son tiles sólidos.

El juego tiene vida, daño, facciones, criatura jugador, enemigo, muerte/remoción de entidad y combate melee mínimo con fases. El jugador puede usar `Space` para iniciar un ataque melee; el ataque entra en `windup`, luego resuelve impacto contra el estado actual del mundo, y después entra en `recovery`.

Regla actual de ataque melee: un ataque confirmado consume la acción aunque no impacte. El daño solo se aplica si, al terminar el `windup`, existe un objetivo enemigo válido dentro del alcance.

El enemigo posee IA simple con `AIControlled`. Detecta al jugador por facción y distancia, lo persigue en línea recta y ataca al entrar en rango melee usando la misma estructura de `ActionEconomy`, `AttackProfile`, `windup` y `recovery` que el jugador.

Se aplicó un refactor menor post-Milestone 4 para reducir complejidad de archivos de runtime largos: `aiSystem` delega targeting en `aiTargeting`, `meleeCombatSystem` ya no construye requests de jugador/IA, y la geometría compartida vive en `geometryRules`.

Se aplicó Milestone 3.5: `ActionEconomy` dejó de ser solo un cooldown numérico y ahora representa acción actual, fase, tiempo restante y ataque pendiente. `AttackProfile` separa `windupSeconds` y `recoverySeconds`. `meleeCombatSystem` no aplica daño instantáneo al recibir input; inicia la acción, resuelve el impacto después del `windup` y libera al actor después del `recovery`.

Se aplicó Milestone 3: se agregaron `ActionEconomy`, `AttackProfile`, `DefenseProfile` y `DamageReduction`; se agregó combate melee mínimo; se reemplazó el ataque básico de prueba por `meleeCombatSystem`; y el daño pasa por reducción plana.

Se aplicó limpieza post-Milestone 3: `src/app/main.js` usa `consumeAttackIntent()` y pasa `attackIntent` a `runSimulationStep`; `keyboardInput.js` no expone alias temporales; `runSimulationStep` no acepta nombres temporales; y `src/simulation/basicAttackSystem.js` fue eliminado.

Se aplicó un refactor de render y colisión pre-Milestone 3: el dibujo de mapa y entidades fue separado desde `canvasRenderer.js` hacia `drawMap.js` y `drawEntities.js`, y la resolución de movimiento contra tiles fue extraída desde `movementSystem.js` hacia `simulation/helpers/movementCollision.js`.

Se aplicó un cambio visual pre-Milestone 3: el renderer dibuja una estética roguelike mínima con tiles de pared como `#`, piso con puntos tenues, grilla translúcida y entidades como glyphs sobre canvas.

Se aplicó un refactor arquitectónico post-Milestone 2: la simulación del frame ahora se orquesta desde `runSimulationStep(...)`, `src/app/main.js` no conoce el orden interno detallado de render ni contiene reglas de simulación, y las reglas puras de daño/rango viven en `src/domain/rules/`.

Todavía no hay conjuros, menú táctico, inventario, cámara compleja, assets externos, guardado, multiplayer ni servidor.

## Sistemas existentes

- `playerControlSystem`: convierte movement intent en velocidad para entidades `PlayerControlled`.
- `aiSystem`: procesa entidades `AIControlled`, busca un target válido mediante `aiTargeting` y asigna velocidad de persecución.
- `movementSystem`: aplica movimiento con `deltaSeconds` y delega la resolución contra tiles a `movementCollision`.
- `actionEconomySystem`: reduce el tiempo restante de acciones en curso.
- `meleeCombatSystem`: procesa requests de ataque melee genéricas, inicia `windup`, resuelve impacto al terminar el `windup`, aplica daño mitigado si hay objetivo válido y gestiona `recovery`.
- `deathSystem`: remueve entidades con `Health.current <= 0`.
- `runSimulationStep`: orquesta el orden de sistemas de simulation para un frame.

## Componentes existentes

- `Position`
- `Velocity`
- `Renderable`
- `Collider`
- `MovementStats`
- `PlayerControlled`
- `AIControlled`
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
- `geometryRules`: contiene helpers geométricos puros compartidos, como centro de rectángulo y distancia entre rectángulos.

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
- `aiTargeting`: busca el objetivo válido más cercano para una entidad `AIControlled` usando facción, distancia, `DefenseProfile` y componentes requeridos.
- `meleeAttackRequests`: construye requests de ataque melee desde input del jugador e IA, sin resolver daño ni fases de acción.

## Factories/setup existentes

- `createPlayer`: crea la entidad jugador y compone sus componentes iniciales usando `addComponents(...)`. Tiene `ActionEconomy`, `AttackProfile`, `DefenseProfile` y `DamageReduction`.
- `createEnemy`: crea un enemigo con `Position`, `Velocity`, `Renderable`, `Collider`, `MovementStats`, `AIControlled`, `Health`, `Creature`, `Faction`, `ActionEconomy`, `AttackProfile`, `DefenseProfile` y `DamageReduction`.

## Archivos de aplicación existentes

- `index.html`
- `style.css`
- `src/app/main.js`
- `src/ecs/world.js`
- `src/domain/components.js`
- `src/domain/rules/damageRules.js`
- `src/domain/rules/attackRules.js`
- `src/domain/rules/geometryRules.js`
- `src/game/createPlayer.js`
- `src/game/createEnemy.js`
- `src/input/keyboardInput.js`
- `src/world/tilemap.js`
- `src/simulation/runSimulationStep.js`
- `src/simulation/playerControlSystem.js`
- `src/simulation/aiSystem.js`
- `src/simulation/movementSystem.js`
- `src/simulation/helpers/movementCollision.js`
- `src/simulation/helpers/meleeHitDetection.js`
- `src/simulation/helpers/aiTargeting.js`
- `src/simulation/helpers/meleeAttackRequests.js`
- `src/simulation/actionEconomySystem.js`
- `src/simulation/meleeCombatSystem.js`
- `src/simulation/deathSystem.js`
- `src/render/canvasRenderer.js`
- `src/render/drawMap.js`
- `src/render/drawEntities.js`

## Próximo objetivo

Milestone 5: Menú táctico pausado.

Crear:

- Capa UI mínima para acciones.
- Pausa táctica single-player.
- Botones de acción.
- Confirmación de acción mediante intent/command o request equivalente, sin aplicar reglas desde UI.
- Separación estricta entre UI y simulation.

## Riesgos actuales

- La IA persigue en línea recta y no tiene pathfinding.
- La IA detecta por distancia y facción, no por línea de visión.
- El ataque tiene fases, pero no hay feedback visual de `windup` o `recovery`; si se vuelve ilegible, debe tratarse en un scope separado.
- La muerte del jugador remueve la entidad sin pantalla de derrota.
- Sobrecargar `runSimulationStep` con lógica que debería vivir en sistemas específicos.
- Convertir `Renderable` en una bolsa de datos visuales demasiado amplia sin diseñar renderer/content.
- Sobrecargar `movementCollision` si se intenta resolver ahí colisiones generales de proyectiles/criaturas/puertas antes de diseñar `collisionSystem`.
- Sobrecargar el ECS mínimo antes de necesitar command buffer o event bus.
- Crear lógica de juego dentro de input o render.
- Pedir a la IA implementaciones grandes sin scope.
- Intentar hacer multiplayer o servidor demasiado pronto.

## Decisiones recientes

- Milestone 4 introdujo `AIControlled` y `aiSystem`.
- El enemigo puede detectar, perseguir y atacar al jugador usando la misma estructura melee que el jugador.
- `meleeCombatSystem` procesa requests de ataque genéricas y ya no decide si una request viene del jugador o de IA.
- `meleeAttackRequests` construye requests de ataque desde input del jugador e IA.
- `aiTargeting` centraliza búsqueda de objetivo válido para IA.
- `geometryRules` centraliza geometría pura compartida por targeting y reglas de ataque.
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
- Se agregó `meleeCombatSystem` para procesar ataques melee.
- Se agregó `meleeHitDetection` como helper de detección melee.
- `DamageReduction` mitiga daño con reducción plana.
- Input produce un intent consumible de ataque con `Space`, pero no aplica daño.
- No se crearon commands ni events todavía.
- No se creó command buffer ni event bus todavía.
- No se implementó UI compleja ni assets externos.
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

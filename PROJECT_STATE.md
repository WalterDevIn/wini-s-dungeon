# PROJECT_STATE

Este archivo resume el estado actual del proyecto para reducir dependencia del contexto del chat.

Debe actualizarse al terminar cada milestone, feature importante o refactor arquitectónico relevante.

## Estado actual

Milestone 5.1 completado: modo táctico pausado mínimo con `Space`, preparación de golpe con `LMB` durante pausa y ejecución del `AttackCommand` preparado al despausar.

Milestone 6 está iniciado y funcional: ya existe foundation mínima de proyectiles genéricos ECS y Firebolt mínimo mediante `CastCommand` con botón derecho del mouse. Firebolt usa `ActionEconomy`: tiene windup de 1.5 segundos, recovery global de 3 segundos, bloquea melee y nuevos casteos durante windup/recovery, permite reapuntar durante windup mediante `aimIntent`, y genera el proyectil solo al finalizar el windup hacia el último target válido. `ActionEconomy.phaseDuration` normaliza el feedback de progreso para cualquier acción activa. Todavía no hay spell slots, recursos, cooldown visual, prepared spells, hotbar conectada a casteo ni menú táctico de conjuros.

Se aplicó el refactor preventivo `refactor/action-economy-rules`: el protocolo común de acciones con fases vive en `src/domain/rules/actionEconomyRules.js`. `meleeCombatSystem` y `spellCastSystem` siguen resolviendo sus reglas específicas, pero ya no setean manualmente en varios lugares `currentAction`, `phase`, `timeRemaining`, `phaseDuration` ni la limpieza de `pendingAttack`/`pendingSpell`.

Se aplicó el refactor preventivo `refactor/creature-factory-foundation`: existe `src/domain/factories/createCreature.js` como factory base para criaturas ECS. `src/game/createPlayer.js` y `src/game/createEnemy.js` conservan sus APIs públicas, pero delegan la construcción común en `createCreature`.

Se aplicó el refactor preventivo `refactor/creature-content-definitions`: las definiciones concretas de criaturas viven ahora en `src/content/creatures`. `humanAdventurer` define la criatura inicial controlada por el jugador y `goblinSkirmisher` define la criatura enemiga inicial controlada por IA. `createPlayer(world)` y `createEnemy(world)` quedan como wrappers temporales de demo que obtienen definiciones desde `creatureRegistry` y llaman a `createCreature`. `Creature.kind` dejó de representar `player`/`enemy` y ahora expresa identidad de criatura mínima: `human` y `goblin`. No se agregaron componentes, sistemas, commands, events ni inventario.

Se agregó `content/basic-creature-roster-rat-bat-stonecrawler`: existen definiciones de content para `rat`, `bat` y `stoneCrawler`, registradas en `creatureRegistry`.

Se aplicó el refactor preventivo `refactor/creature-position-as-spawn-override`: las definiciones de `src/content/creatures` ya no contienen `position`. La posición ahora es dato de spawn y se pasa a `createCreature(world, definition, { position })`. `createPlayer` conserva la posición inicial `{ x: 96, y: 96 }` sin tocar su wrapper.

Se agregó `feature/demo-encounter-spawn-list`: existe `src/game/createDemoEncounter.js` como encounter estático de demo. `createGameApp` ahora crea el jugador y luego llama a `createDemoEncounter(world)` en lugar de crear un único `createEnemy(world)`. El encounter inicial spawnea `rat`, `bat`, `goblinSkirmisher` y `stoneCrawler` con posiciones explícitas usando `createCreature(world, definition, { position })`. El tilemap estático ahora tiene una sala inicial a la izquierda, una sala de encuentro a la derecha y una conexión caminable entre ambas. No hay dungeon generation procedural, puertas, línea de visión ni sistema dinámico de spawn.

Se agregó `feature/enemy-action-progress-indicator`: el renderer dibuja indicadores circulares debajo de enemigos con `AIControlled` durante `windup` y `recovery`. El indicador lee `ActionEconomy.timeRemaining`, `phaseDuration` y `phase` desde ECS, usa verde para windup y amarillo para recovery, y es feedback visual solamente. No modifica simulation, reglas, IA, daño ni tiempos.

El proyecto tiene una aplicación mínima que abre en navegador, carga un canvas, ejecuta un game loop con `requestAnimationFrame`, dibuja un tilemap fijo simple y permite mover un jugador como entidad ECS.

El jugador se controla con teclado, se mueve usando `deltaSeconds`, no atraviesa paredes del tilemap y no sale del mapa porque los bordes son tiles sólidos.

El jugador ataca con click izquierdo mediante un `AttackCommand` mínimo. En modo running, el click izquierdo genera un command inmediato. En modo táctico pausado, el click izquierdo prepara un `AttackCommand` pendiente que se entrega a la simulación al volver a running.

El botón derecho del mouse genera un `CastCommand` mínimo para `firebolt` solo en modo running. `commandMapper` toma la posición actual del puntero y la guarda como `initialTargetPoint`; input no crea proyectiles y app no crea proyectiles.

`createGameApp` construye un `aimIntent` abstracto por frame desde `mouseInput.getSnapshot().pointer` y lo pasa a `runSimulationStep`. Simulation consume ese intent sin leer mouse físico, DOM ni UI.

La pausa táctica vive en app/session, no en ECS ni simulation. Mientras el modo táctico está pausado, `runSimulationStep` no se llama; render y HUD siguen actualizándose.

El juego tiene vida, daño, facciones, criaturas enemigas, muerte/remoción de entidad y combate melee mínimo con fases. El ataque entra en `windup`, luego resuelve impacto contra el estado actual del mundo, y después entra en `recovery`.

Regla actual de ataque melee: un ataque confirmado consume la acción aunque no impacte. El daño solo se aplica si, al terminar el `windup`, existe un objetivo enemigo válido dentro del alcance. Como melee ya ignora nuevos ataques si `ActionEconomy.currentAction` existe, Firebolt bloquea melee durante su windup y recovery global sin tocar lógica especial de melee.

Los enemigos poseen IA simple con `AIControlled`. Detectan al jugador por facción y distancia, lo persiguen en línea recta y atacan al entrar en rango melee usando la misma estructura de `ActionEconomy`, `AttackProfile`, `windup` y `recovery` que el jugador. Durante windup/recovery, el renderer muestra un indicador circular debajo de cada enemigo.

Hay proyectiles genéricos como entidades ECS con `Projectile`, `Lifetime`, `DamageOnHit`, `Position`, `Velocity`, `Collider`, `Renderable` y `Faction`. `projectileMovementSystem` mueve proyectiles y los destruye contra tiles sólidos. `projectileImpactSystem` detecta impacto de proyectiles contra criaturas enemigas, filtra por facción y `DefenseProfile.canBeHit`, aplica daño mitigado con `damageRules` y remueve el proyectil si corresponde. `lifetimeSystem` remueve cualquier entidad con `Lifetime` vencido. Ya no existe proyectil automático de prueba al iniciar el juego; la verificación manual de proyectiles se hace casteando Firebolt con `RMB`.

Firebolt está definido como conjuro mínimo data-driven en `src/content/spells/firebolt.js`, registrado por `src/content/spells/spellRegistry.js`. La definición incluye `id`, `name`, `kind`, `targeting`, `cast` y `effect`. Su efecto actual es `spawnProjectile`; el proyectil usa `speed: 260`, `size: 10`, `damage: 3`, `lifetimeSeconds: 1.4`, `color: "#ff7a33", glyph: "x", fontSize: 16, destroyOnWall: true y destroyOnHit: true`.

`spellCastSystem` procesa acciones de spell en tres pasos: primero actualiza targets pendientes de spells en windup usando `aimIntent`, luego resuelve acciones de casteo en curso, y después acepta nuevos `CastCommand` solo si el actor tiene `ActionEconomy` disponible mediante `canStartAction`. Al iniciar Firebolt usa `startAction` para guardar `pendingSpell`, poner `currentAction = "spellCast"`, `phase = "windup"`, `timeRemaining = 1.5` y `phaseDuration = 1.5`. Durante windup, `pendingSpell.targetPoint` se actualiza con el último `aimIntent.targetPoint` válido. Al terminar el windup crea el proyectil mediante `spellProjectileFactory` hacia ese último target válido, usa `transitionActionPhase` para pasar a `recovery` por 3 segundos con `phaseDuration = 3`, y luego usa `clearAction`.

`meleeCombatSystem` procesa requests de ataque melee genéricas, inicia `windup` con `startAction`, resuelve impacto al terminar el `windup`, aplica daño mitigado si hay objetivo válido, pasa a `recovery` con `transitionActionPhase` y limpia la acción con `clearAction`.

`spellProjectileFactory` lee el proyectil desde `spellDefinition.effect.projectile`. Firebolt nace desde el centro del actor, viaja hacia el `targetPoint` resuelto al final del windup, usa `Projectile`, `Lifetime`, `DamageOnHit`, `Position`, `Velocity`, `Collider`, `Renderable` y `Faction`, y luego queda bajo los sistemas genéricos de proyectiles.

La UI mínima muestra feedback de input, cursor custom y hotbar visual mínima. La hotbar visual tiene modos `inventory`, `spells` y `features`, pero todavía no representa inventario real, items, spell slots, prepared spells ni features activables. La UI no aplica reglas ni modifica ECS.

`main.js` quedó reducido a bootstrap. La coordinación de app/session, creación de mundo, input, renderer, UI, loop, simulation, render y snapshot vive en `createGameApp`. La conversión de input a command vive en `commandMapper`. El estado de pausa táctica vive en `tacticalModeController`.

## Sistemas existentes

- `playerControlSystem`: convierte movement intent en velocidad para entidades `PlayerControlled`.
- `aiSystem`: procesa entidades `AIControlled`, busca un target válido mediante `aiTargeting` y asigna velocidad de persecución.
- `movementSystem`: aplica movimiento con `deltaSeconds` y delega la resolución contra tiles a `movementCollision`.
- `spellCastSystem`: procesa `CastCommand`, actualiza target pendiente durante windup con `aimIntent`, obtiene definición desde `spellRegistry`, delega el protocolo ActionEconomy en `actionEconomyRules` y crea proyectiles de spell mediante `spellProjectileFactory` al terminar el windup.
- `projectileMovementSystem`: mueve entidades con `Projectile`, `Position`, `Velocity` y `Collider`; remueve proyectiles al chocar contra tiles sólidos si `destroyOnWall` está activo.
- `projectileImpactSystem`: detecta impacto de proyectiles contra criaturas enemigas válidas, aplica `DamageOnHit` mediante `damageRules` y remueve el proyectil si `destroyOnHit` está activo.
- `actionEconomySystem`: reduce el tiempo restante de acciones en curso.
- `meleeCombatSystem`: procesa requests de ataque melee genéricas, delega el protocolo ActionEconomy en `actionEconomyRules`, resuelve impacto al terminar el `windup`, aplica daño mitigado si hay objetivo válido y gestiona su regla específica de impacto.
- `lifetimeSystem`: reduce `Lifetime.timeRemaining` y remueve cualquier entidad con lifetime vencido.
- `deathSystem`: remueve entidades con `Health.current <= 0`.
- `runSimulationStep`: orquesta el orden de sistemas de simulation para un frame y recibe `aimIntent` desde app.

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
- `Projectile`
- `Lifetime`
- `DamageOnHit`

## Commands existentes

- `AttackCommand`: command mínimo para solicitar ataque melee desde la acción primaria del jugador.
- `CastCommand`: command mínimo para solicitar casteo de un spell con `actorId`, `spellId` e `initialTargetPoint`.

## Events existentes

Ninguno.

## Content existente

- `src/content/spells/firebolt.js`: definición mínima data-driven de Firebolt como conjuro con targeting, cast y effect.
- `src/content/spells/spellRegistry.js`: registry mínimo para obtener definiciones de spell por id.
- `src/content/creatures/humanAdventurer.js`: definición data-driven mínima de la criatura inicial del jugador, sin posición.
- `src/content/creatures/goblinSkirmisher.js`: definición data-driven mínima de la criatura enemiga inicial, sin posición.
- `src/content/creatures/rat.js`: definición data-driven mínima de rat, sin posición.
- `src/content/creatures/bat.js`: definición data-driven mínima de bat, sin posición.
- `src/content/creatures/stoneCrawler.js`: definición data-driven mínima de stoneCrawler, sin posición.
- `src/content/creatures/creatureRegistry.js`: registry mínimo para obtener definiciones de criatura por id.

## Factories existentes

- `src/domain/factories/createCreature.js`: factory mínima para crear criaturas ECS desde una definición de content y datos de spawn explícitos, actualmente `position`, con componentes comunes y controles opcionales `PlayerControlled` o `AIControlled`.
- `src/game/createPlayer.js`: wrapper de demo que conserva `createPlayer(world)`, obtiene `humanAdventurer` desde content y delega en `createCreature` con posición inicial `{ x: 96, y: 96 }`.
- `src/game/createEnemy.js`: wrapper legacy/demo que conserva `createEnemy(world)`, obtiene `goblinSkirmisher` desde content y delega en `createCreature` con posición inicial `{ x: 240, y: 192 }`, pero el arranque actual usa `createDemoEncounter` en su lugar.
- `src/game/createDemoEncounter.js`: encounter estático de demo que spawnea `rat`, `bat`, `goblinSkirmisher` y `stoneCrawler` con posiciones explícitas.

## Render existente

- `src/render/canvasRenderer.js`: renderiza mapa, entidades y action indicators.
- `src/render/drawMap.js`: dibuja el tilemap estático.
- `src/render/drawEntities.js`: dibuja entidades renderizables.
- `src/render/drawActionIndicators.js`: dibuja indicadores circulares de progreso bajo enemigos `AIControlled` durante `windup` y `recovery`.

## Reglas puras existentes

- `damageRules`: contiene cálculo de daño mitigado y aplicación de daño a `Health`.
- `attackRules`: contiene regla pura mínima para calcular rango de ataque entre colliders.
- `geometryRules`: contiene helpers geométricos puros compartidos, como centro de rectángulo, distancia entre rectángulos y overlap de rectángulos.
- `actionEconomyRules`: contiene el protocolo común de acciones con fases: `canStartAction`, `startAction`, `transitionActionPhase` y `clearAction`.

## Input existente

- Input de teclado mínimo para movimiento con WASD y flechas.
- `keyboardInput`: factory pública que expone `getMovementIntent`, `consumeTacticalToggleIntent` y `getSnapshot`.
- `mouseInput`: factory pública que expone `consumePrimaryClickIntent`, `consumeSecondaryClickIntent` y `getSnapshot`.
- Input no modifica ECS ni componentes.
- Input no aplica daño.
- Input no crea proyectiles.

## UI existente

- `hudUi`: orquesta nodos DOM del HUD y delega layout/update en módulos específicos.
- `hudLayout`: contiene template/configuración del HUD de teclado, mouse, rueda, pausa, cursor custom, hotbar visual y debug panel.
- `hudUpdate`: contiene helpers para actualizar feedback visual, cursor custom, anillo radial de acción y hotbar visual.
- `quickBarViewState`: contiene estado visual de UI para alternar hotbar entre `inventory`, `spells` y `features` con `Q`/`F` por flanco de presión.
- `buildUiSnapshot`: construye un snapshot simple para UI con input, estado táctico, último command, estado de acción del jugador, duración de fase y progreso de fase usando `ActionEconomy.phaseDuration`.
- La UI no modifica ECS ni llama sistemas de simulation.

## App helpers existentes

- `createGameApp`: coordina creación de mundo, input, renderer, UI, entidades iniciales, game loop, simulation step, render, modo táctico, `aimIntent` y snapshot UI. Crea el jugador y el encounter estático de demo.
- `commandMapper`: convierte input de app en commands mínimos; actualmente `LMB` produce `AttackCommand` y `RMB` produce `CastCommand` de Firebolt si hay puntero válido.
- `tacticalModeController`: mantiene modo `running`/`tacticalPaused`, command pendiente y liberación del command al despausar.

## Archivos de aplicación existentes

- `index.html`
- `style.css`
- `src/app/main.js`
- `src/app/createGameApp.js`
- `src/app/commandMapper.js`
- `src/app/tacticalModeController.js`
- `src/ecs/world.js`
- `src/domain/components.js`
- `src/domain/commands.js`
- `src/domain/factories/createCreature.js`
- `src/domain/rules/damageRules.js`
- `src/domain/rules/attackRules.js`
- `src/domain/rules/geometryRules.js`
- `src/domain/rules/actionEconomyRules.js`
- `src/content/spells/firebolt.js`
- `src/content/spells/spellRegistry.js`
- `src/content/creatures/humanAdventurer.js`
- `src/content/creatures/goblinSkirmisher.js`
- `src/content/creatures/rat.js`
- `src/content/creatures/bat.js`
- `src/content/creatures/stoneCrawler.js`
- `src/content/creatures/creatureRegistry.js`
- `src/game/createPlayer.js`
- `src/game/createEnemy.js`
- `src/game/createDemoEncounter.js`
- `src/game/playerQueries.js`
- `src/game/buildUiSnapshot.js`
- `src/input/keyboardInput.js`
- `src/input/keyboardKeyState.js`
- `src/input/keyboardSnapshot.js`
- `src/input/mouseInput.js`
- `src/input/mouseButtonState.js`
- `src/input/mouseWheelState.js`
- `src/input/mousePointerState.js`
- `src/world/tilemap.js`
- `src/simulation/runSimulationStep.js`
- `src/simulation/playerControlSystem.js`
- `src/simulation/aiSystem.js`
- `src/simulation/movementSystem.js`
- `src/simulation/spellCastSystem.js`
- `src/simulation/projectileMovementSystem.js`
- `src/simulation/projectileImpactSystem.js`
- `src/simulation/lifetimeSystem.js`
- `src/simulation/helpers/movementCollision.js`
- `src/simulation/helpers/meleeHitDetection.js`
- `src/simulation/helpers/projectileHitDetection.js`
- `src/simulation/helpers/spellProjectileFactory.js`
- `src/simulation/helpers/aiTargeting.js`
- `src/simulation/helpers/meleeAttackRequests.js`
- `src/simulation/actionEconomySystem.js`
- `src/simulation/meleeCombatSystem.js`
- `src/simulation/deathSystem.js`
- `src/ui/hudUi.js`
- `src/ui/hudLayout.js`
- `src/ui/hudUpdate.js`
- `src/ui/quickBarViewState.js`
- `src/render/canvasRenderer.js`
- `src/render/drawMap.js`
- `src/render/drawEntities.js`
- `src/render/drawActionIndicators.js`

## Próximo objetivo

Milestone Pre-7 siguiente scope recomendado: validar el encounter estático y luego elegir entre `feature/inventory-trait-foundation` o Milestone 7 `doors-and-vision`. Inventory debe nacer como trait ECS genérico aplicable a criaturas o contenedores, no como propiedad especial del jugador.

Antes de agregar dash, items, features, scrolls o nuevas acciones con fases, reutilizar `actionEconomyRules` en lugar de duplicar protocolo de `ActionEconomy` dentro de cada sistema.

## Riesgos actuales

- Firebolt por `RMB` usa `ActionEconomy`, pero no tiene spell slots, recursos ni cooldown visual.
- `spellCastSystem` todavía concentra varias responsabilidades: actualización de target, validación de spell, resolución de fase y resolución de efecto. No partir todavía salvo que aparezca un segundo spell o segundo effect type, o que el archivo siga creciendo.
- `createCreature` todavía recibe definiciones con estructura mínima; no existe sistema de species/archetype/progression y no debe agregarse sin scope.
- `createDemoEncounter` es un encounter estático de demo, no un sistema de spawn dinámico ni generación de mazmorra.
- El tilemap nuevo es estático y manual; no hay `mapGeneration`, `rooms`, puertas ni línea de visión.
- Inventory todavía no existe; cuando se agregue, debe ser trait ECS reutilizable para criaturas/contenedores.
- La IA persigue en línea recta y no tiene pathfinding.
- La IA detecta por distancia y facción, no por línea de visión.
- La muerte del jugador remueve la entidad sin pantalla de derrota.
- El click izquierdo queda definido como acción primaria del modo de juego; cuando exista inventario/UI interactiva, la capa app/UI deberá poder capturar clicks para no enviarlos como comandos de combate.
- `movementIntent` sigue entrando crudo a `runSimulationStep`; es deuda aceptada para movimiento continuo y no debe confundirse con un flujo totalmente command-driven.
- No existe command buffer; solo hay command mínimo directo por frame y un command táctico pendiente máximo en app/session.
- No existe event bus ni events.
- `createGameApp` sigue siendo el punto de presión de app/session; si crece el modo táctico, conviene extraer más coordinación.
- La hotbar visual deriva selección desde `wheelIndex`; es una solución provisional de UI, no una fuente de verdad de inventario, spellcasting ni features activables.
- Sobrecargar el ECS mínimo antes de necesitar command buffer o event bus.
- Crear lógica de juego dentro de input o render.
- Pedir a la IA implementaciones grandes sin scope.

## Decisiones recientes

- Se agregó `src/render/drawActionIndicators.js`.
- `canvasRenderer` ahora llama `drawActionIndicators` después de `drawEntities`.
- Los indicadores de acción se dibujan solo para entidades con `AIControlled`, `Position`, `Renderable` y `ActionEconomy`.
- Los indicadores aparecen solo durante `windup` o `recovery`.
- Windup usa verde `#00ff66`; recovery usa amarillo `#ffcc33`.
- El progreso visual usa `1 - timeRemaining / phaseDuration` con clamp `0..1`.
- Esta feature es solo feedback visual en render; no modifica simulation, reglas, IA, daño, tiempos, UI, input ni CSS.
- ECS será la fuente de verdad para entidades dinámicas.
- El combate será en tiempo real pausado, no por turnos clásicos.
- No se usará CA como defensa central.
- Armadura mitigará daño.
- Destreza no dará evasión pasiva universal.
- Descansos y rituales largos serán time-skips.
- No habrá multiplayer en la demo inicial.

# PROJECT_STATE

Este archivo resume el estado actual del proyecto para reducir dependencia del contexto del chat.

Debe actualizarse al terminar cada milestone, feature importante o refactor arquitectónico relevante.

## Estado actual

Milestone 6 está iniciado y funcional: existe foundation mínima de proyectiles genéricos ECS y Firebolt mínimo mediante `CastCommand` con botón derecho del mouse. Firebolt usa `ActionEconomy`: tiene windup de 1.5 segundos, recovery global de 3 segundos, bloquea melee y nuevos casteos durante windup/recovery, permite reapuntar durante windup mediante `aimIntent`, y genera el proyectil solo al finalizar el windup hacia el último target válido. Todavía no hay spell slots, recursos, cooldown visual, prepared spells, hotbar conectada a casteo ni menú táctico de conjuros.

Se aplicó `feature/generated-dungeon-foundation-v1`: el tilemap manual fijo fue reemplazado por generación v1 desde `src/world`. `src/world/tilemap.js` exporta `tilemap`, `tileSize`, `dungeonMetadata` y conserva `isSolidTile`, `isSolidAtPixel` y `collidesWithSolidTile`. `dungeonMetadata` conserva `rooms`, `corridors`, `features`, `playerSpawn`, `encounterSpawns`, `stairsUp` y `stairsDown`. Escaleras y huecos funcionales siguen fuera de scope. No se agregaron componentes, sistemas, commands ni events.

Se aplicó `feature/palace-ring-layout-v1`: el generador soporta layout palacial determinista mediante `layout: "palaceRing"`. Este layout crea una gran sala central rectangular `central_hall`, miniantesalas `antechamber`, un pasillo principal `main_corridor` y cámaras externas `external_room`. El tilemap mantiene solo `#` como muro sólido y `.` como piso caminable. Las regiones viven en metadata; no se usan símbolos especiales de render. No se agregaron componentes, sistemas, commands ni events.

Se aplicó `fix/palace-ring-layout-shape`: el corredor principal ya no se genera como anillo rectangular literal por bounding box. Ahora se construye desde una máscara de tiles ocupados por `central_hall + antechamber` usando distancia Chebyshev local, con ancho 2 y separación de 1 tile. Las antesalas 3x3 quedan separadas de la sala principal y tienen dos conexiones caminables explícitas: una hacia `central_hall` y otra hacia `main_corridor`. La `central_hall` fue agrandada a 20x10 y se agregaron más candidatos de `external_room` alrededor del corredor. No se agregaron componentes, sistemas, commands ni events.

Se aplicó `fix/palace-ring-layout-asymmetry`: el layout palacial reduce simetría visual. Las `antechamber` ya no se ubican obligatoriamente centradas ni una por cada pared; usan posiciones deterministas no centradas, con 1 a 2 posibles antesalas por lado cuando entran. Las `external_room` se intentan colocar adosadas al `main_corridor`, con conexión directa o conector corto como fallback. No se agregaron componentes, sistemas, commands ni events.

Se aplicó `refactor/palace-ring-generation-modules`: `src/world/palaceRingGeneration.js` quedó como orquestador de menos de 100 líneas y el layout palacial fue dividido en módulos específicos: `palaceRingConfig`, `palaceRingCentralHall`, `palaceRingAntechambers`, `palaceRingCorridor`, `palaceRingExternalRooms` y `palaceRingConnectors`. También se extrajeron helpers compartidos de world en `mapGrid`, `mapGeometry` y `mapFeatureState` para eliminar duplicación con `mapGeneration.js`. No cambió gameplay ni se agregaron componentes, sistemas, commands ni events.

El generador vive en `src/world/mapGeneration.js`, que actúa como entrypoint/dispatcher de layouts. `mapGeneration.js` despacha entre `classic` y `palaceRing`; ambos usan helpers compartidos de grid/geometría/feature state. El layout palacial específico vive en los módulos `src/world/palaceRing*.js`. Los helpers de features viven en `src/world/mapFeatures.js`, que soporta features rectangulares y features desde tiles arbitrarios. Los helpers de metadata/spawns viven en `src/world/mapMetadata.js`, que prefiere `central_hall` como spawn del jugador y `external_room`/`antechamber` para spawns del encounter demo.

`createPlayer` recibe la posición del jugador desde app mediante `{ position }`. `createDemoEncounter` recibe `{ spawns }` y crea el encounter demo usando spawns derivados del dungeon generado. `createGameApp` importa `dungeonMetadata` desde `src/world/tilemap.js` y pasa `dungeonMetadata.playerSpawn` / `dungeonMetadata.encounterSpawns` a las factories de game.

Se aplicó `refactor/app-frame-boundary-and-player-query-cleanup`: `createGameApp` quedó como composition root y loop mínimo. La ejecución de cada frame vive en `src/app/gameFrame.js`, `aimIntent` se construye en `src/app/aimIntent.js` como intent abstracto frame-local, y el centro del jugador se obtiene desde `src/game/playerQueries.js` mediante `getPlayerCenterPoint(world)`. No existe todavía una capa formal `domain/intents.js`.

Se aplicó `refactor/render-snapshot-boundary`: existe `src/game/buildRenderSnapshot.js` como traductor ECS -> datos de render. `canvasRenderer`, `drawEntities` y `drawActionIndicators` consumen datos preparados y ya no consultan `world` directamente. Render conserva solo dibujo, cámara visual, colores y geometría.

El proyecto tiene una aplicación mínima que abre en navegador, carga un canvas, ejecuta un game loop con `requestAnimationFrame`, dibuja un tilemap generado y permite mover un jugador como entidad ECS.

El jugador se controla con teclado, se mueve usando `deltaSeconds`, no atraviesa paredes del tilemap y no sale del mapa porque los bordes son tiles sólidos.

El jugador ataca con click izquierdo mediante un `AttackCommand` mínimo. En modo running, el click izquierdo genera un command inmediato. En modo táctico pausado, el click izquierdo prepara un `AttackCommand` pendiente que se entrega a la simulación al volver a running.

El botón derecho del mouse genera un `CastCommand` mínimo para `firebolt` solo en modo running. `commandMapper` convierte la posición física del puntero a coordenadas de mundo mediante la cámara antes de guardarla como `initialTargetPoint`; input no crea proyectiles y app no crea proyectiles.

`gameFrame` construye un `aimIntent` abstracto por frame desde `mouseInput.getSnapshot().pointer`, lo convierte a coordenadas de mundo con la cámara y lo pasa a `runSimulationStep`. Simulation consume ese intent sin leer mouse físico, DOM ni UI.

La pausa táctica vive en app/session, no en ECS ni simulation. Mientras el modo táctico está pausado, `runSimulationStep` no se llama; render y HUD siguen actualizándose.

El juego tiene vida, daño, facciones, criaturas enemigas, muerte/remoción de entidad y combate melee mínimo con fases. El ataque entra en `windup`, luego resuelve impacto contra el estado actual del mundo, y después entra en `recovery`.

Los enemigos poseen IA simple con `AIControlled`. Detectan al jugador por facción y distancia, lo persiguen en línea recta y atacan al entrar en rango melee usando la misma estructura de `ActionEconomy`, `AttackProfile`, `windup` y `recovery` que el jugador. Durante windup/recovery, el renderer muestra un indicador circular centrado sobre cada enemigo.

Hay proyectiles genéricos como entidades ECS con `Projectile`, `Lifetime`, `DamageOnHit`, `Position`, `Velocity`, `Collider`, `Renderable` y `Faction`. `projectileMovementSystem` mueve proyectiles y los destruye contra tiles sólidos. `projectileImpactSystem` detecta impacto de proyectiles contra criaturas enemigas, filtra por facción y `DefenseProfile.canBeHit`, aplica daño mitigado con `damageRules` y remueve el proyectil si corresponde. `lifetimeSystem` remueve cualquier entidad con `Lifetime` vencido.

Firebolt está definido como conjuro mínimo data-driven en `src/content/spells/firebolt.js`, registrado por `src/content/spells/spellRegistry.js`. El proyectil se crea al terminar el windup hacia el último target válido en coordenadas de mundo.

La UI mínima muestra feedback de input, cursor custom, hotbar visual mínima y barra de vida del jugador. La hotbar visual tiene modos `inventory`, `spells` y `features`, pero todavía no representa inventario real, items, spell slots, prepared spells ni features activables. La UI no aplica reglas ni modifica ECS.

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
- `src/game/createPlayer.js`: wrapper de demo que conserva `createPlayer(world, { position })`, obtiene `humanAdventurer` desde content y delega en `createCreature` con posición inyectada desde metadata de dungeon.
- `src/game/createEnemy.js`: wrapper legacy/demo que conserva `createEnemy(world)`, pero el arranque actual usa `createDemoEncounter` en su lugar.
- `src/game/createDemoEncounter.js`: encounter estático de demo que recibe spawns inyectados y crea `rat`, `bat`, `goblinSkirmisher` y `stoneCrawler` en posiciones generadas caminables.

## World existente

- `src/world/tilemap.js`: exporta el tilemap generado con layout `palaceRing`, `tileSize`, `dungeonMetadata` y helpers de colisión.
- `src/world/mapGeneration.js`: orquesta generación de dungeon y despacha entre layouts, incluyendo `classic` y `palaceRing`.
- `src/world/palaceRingGeneration.js`: orquesta el layout palacial usando módulos específicos.
- `src/world/palaceRingConfig.js`: contiene constantes y resolución de config del layout palacial.
- `src/world/palaceRingCentralHall.js`: crea `central_hall`.
- `src/world/palaceRingAntechambers.js`: crea `antechamber` asimétricas.
- `src/world/palaceRingCorridor.js`: crea `main_corridor` desde la máscara central.
- `src/world/palaceRingExternalRooms.js`: crea `external_room`.
- `src/world/palaceRingConnectors.js`: crea conectores caminables entre regiones palaciales.
- `src/world/mapGrid.js`: contiene helpers compartidos de grid.
- `src/world/mapGeometry.js`: contiene helpers compartidos de geometría.
- `src/world/mapFeatureState.js`: contiene helpers compartidos para registrar y congelar features.
- `src/world/mapFeatures.js`: crea features rectangulares y features no rectangulares desde tiles con `id`, `type`, `bounds`, `tiles`, `center`, `exits` y metadata semántica adicional.
- `src/world/mapMetadata.js`: deriva player spawn, encounter spawns y markers de stair up/down desde rooms generadas, prefiriendo regiones palaciales cuando existen.

## Render existente

- `src/game/buildRenderSnapshot.js`: construye el snapshot de render desde ECS con `tilemap`, `camera`, entidades renderizables e indicadores de acción ya derivados.
- `src/render/canvasRenderer.js`: renderiza mapa, entidades y action indicators desde un render snapshot; no recibe `world` directamente.
- `src/render/camera.js`: contiene helpers puros para calcular cámara, convertir coordenadas mundo/pantalla y clamppear el viewport contra el tilemap.
- `src/render/drawMap.js`: dibuja el tilemap aplicando offset de cámara.
- `src/render/drawEntities.js`: dibuja entidades renderizables recibidas desde el render snapshot aplicando offset de cámara.
- `src/render/drawActionIndicators.js`: dibuja indicadores circulares de progreso recibidos desde el render snapshot, aplicando offset de cámara.

## App helpers existentes

- `createGameApp`: composition root; crea mundo, input, renderer, UI, tactical mode, entidades iniciales, estado mínimo de frame y arranca el loop.
- `gameFrame`: ejecuta la coordinación de un frame con dependencias inyectadas: input snapshot, cámara, commands, simulation, render snapshot y UI snapshot.
- `aimIntent`: construye el intent abstracto frame-local de apuntado desde `mouseSnapshot` y una función de conversión pantalla -> mundo. No existe todavía `domain/intents.js`.
- `commandMapper`: convierte input de app en commands mínimos; actualmente `LMB` produce `AttackCommand` y `RMB` produce `CastCommand` de Firebolt si hay puntero válido.
- `tacticalModeController`: mantiene modo `running`/`tacticalPaused`, command pendiente y liberación del command al despausar.

## Game queries existentes

- `playerQueries`: contiene queries read-only del jugador. Expone `findPlayerEntity(world)` y `getPlayerCenterPoint(world)`.

## Próximo objetivo

Validar visual y jugablemente `feature/palace-ring-layout-v1`: central hall grande, antechambers separadas y asimétricas, corredor por contorno, external rooms adosadas, spawns, cámara, colisión y combate en salas/pasillos. Luego decidir si conviene mejorar la generación palacial con arcos parciales, pasillos de acceso, subpasillos, puertas o interacción de escaleras.

## Riesgos actuales

- El layout `palaceRing` es determinista y básico; no hay todavía validación formal de conectividad con flood fill ni tests automatizados.
- La asimetría actual es determinista por candidatos fijos; puede necesitar seed real cuando existan más variantes de piso.
- El contorno por distancia Chebyshev es simple y puede necesitar refinamiento visual cuando haya más formas de sala.
- La cámara no tiene smoothing, zoom ni tratamiento especial para mapas más pequeños que el viewport; es una cámara mínima determinista.
- La IA persigue en línea recta y no tiene pathfinding; con mapas generados y pasillos puede atascarse o perseguir mal hasta Milestone 7+ o pathfinding futuro.
- Firebolt por `RMB` usa `ActionEconomy`, pero no tiene spell slots, recursos ni cooldown visual.
- `spellCastSystem` todavía concentra varias responsabilidades: actualización de target, validación de spell, resolución de fase y resolución de efecto. No partir todavía salvo que aparezca un segundo spell o segundo effect type, o que el archivo siga creciendo.
- `createDemoEncounter` sigue siendo un encounter estático de demo con spawns generados, no un sistema de spawn procedural avanzado.
- Inventory todavía no existe; cuando se agregue, debe ser trait ECS reutilizable para criaturas/contenedores.
- La IA detecta por distancia y facción, no por línea de visión.
- La muerte del jugador remueve la entidad sin pantalla de derrota.
- El click izquierdo queda definido como acción primaria del modo de juego; cuando exista inventario/UI interactiva, la capa app/UI deberá poder capturar clicks para no enviarlos como comandos de combate.
- `movementIntent` sigue entrando crudo a `runSimulationStep`; es deuda aceptada para movimiento continuo y no debe confundirse con un flujo totalmente command-driven.
- No existe command buffer; solo hay command mínimo directo por frame y un command táctico pendiente máximo en app/session.
- No existe event bus ni events.
- `gameFrame` sigue siendo el punto de presión de app/session; si crece el modo táctico, conviene extraer más coordinación sin devolver lógica a `createGameApp`.
- Crear lógica de juego dentro de input o render.
- Pedir a la IA implementaciones grandes sin scope.

## Decisiones recientes

- Se implementó `refactor/palace-ring-generation-modules` sobre `feature/palace-ring-layout-v1`.
- `palaceRingGeneration.js` quedó reducido a orquestador.
- La generación palacial fue dividida en módulos específicos para config, central hall, antechambers, corridor, external rooms y connectors.
- Se extrajeron `mapGrid`, `mapGeometry` y `mapFeatureState` para evitar duplicación de helpers entre layouts.
- `mapGeneration.js` usa helpers compartidos y conserva el layout clásico.
- No cambió gameplay ni se agregaron componentes, sistemas, commands ni events.
- ECS será la fuente de verdad para entidades dinámicas.
- El combate será en tiempo real pausado, no por turnos clásicos.
- No se usará CA como defensa central.
- Armadura mitigará daño.
- Destreza no dará evasión pasiva universal.
- Descansos y rituales largos serán time-skips.
- No habrá multiplayer en la demo inicial.

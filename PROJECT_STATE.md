# PROJECT_STATE

Este archivo resume el estado actual del proyecto para reducir dependencia del contexto del chat.

Debe actualizarse al terminar cada milestone o feature importante.

## Estado actual

Milestone 5.1 completado: modo táctico pausado mínimo con `Space`, preparación de golpe con `LMB` durante pausa y ejecución del `AttackCommand` preparado al despausar.

El proyecto tiene una aplicación mínima que abre en navegador, carga un canvas, ejecuta un game loop con `requestAnimationFrame`, dibuja un tilemap fijo simple y permite mover un jugador como entidad ECS.

El jugador se controla con teclado, se mueve usando `deltaSeconds`, no atraviesa paredes del tilemap y no sale del mapa porque los bordes son tiles sólidos.

El jugador ataca con click izquierdo mediante un `AttackCommand` mínimo. En modo running, el click izquierdo genera un command inmediato. En modo táctico pausado, el click izquierdo prepara un `AttackCommand` pendiente que se entrega a la simulación al volver a running.

La pausa táctica vive en app/session, no en ECS ni simulation. Mientras el modo táctico está pausado, `runSimulationStep` no se llama; render y HUD siguen actualizándose.

El juego tiene vida, daño, facciones, criatura jugador, enemigo, muerte/remoción de entidad y combate melee mínimo con fases. El ataque entra en `windup`, luego resuelve impacto contra el estado actual del mundo, y después entra en `recovery`.

Regla actual de ataque melee: un ataque confirmado consume la acción aunque no impacte. El daño solo se aplica si, al terminar el `windup`, existe un objetivo enemigo válido dentro del alcance.

El enemigo posee IA simple con `AIControlled`. Detecta al jugador por facción y distancia, lo persigue en línea recta y ataca al entrar en rango melee usando la misma estructura de `ActionEconomy`, `AttackProfile`, `windup` y `recovery` que el jugador.

La UI mínima muestra feedback de input dividido en dos hemisferios inferiores: teclado en esquina inferior izquierda y mouse/rueda en esquina inferior derecha. El mouse usa una grilla 3x3 con `LMB`, `RMB`, `M5`, `Wheel` y `M4`; `LMB` y `RMB` tienen tamaño visual amplio, mientras `M4` y `M5` quedan compactos. El indicador externo de rueda con número/dirección queda oculto temporalmente; el botón `Wheel` integrado en la grilla sigue visible y el debug panel sigue mostrando el índice de rueda. El teclado muestra `Tab`, `Q`, `W`, `F`, `A`, `R`, `S` y `Space`. La etiqueta superior `Pausa` solo aparece durante `tacticalPaused`. El debug panel sigue mostrando modo, acción preparada, índice de rueda, último command y estado de acción del jugador. La UI no aplica reglas ni modifica ECS.

El cursor nativo está oculto sobre el juego y la UI muestra un cursor custom tipo `+` como overlay DOM. Durante `windup` y `recovery`, la UI muestra un anillo radial alrededor del cursor usando el progreso derivado de `ActionEconomy` y `AttackProfile`; esto no modifica daño, tiempos ni reglas de combate. El cursor custom se posiciona con `left/top` desde JS y mantiene el centrado con CSS.

`main.js` quedó reducido a bootstrap. La coordinación de app/session, creación de mundo, input, renderer, UI, loop, simulation, render y snapshot vive en `createGameApp`. La conversión de input a command vive en `commandMapper`. El estado de pausa táctica vive en `tacticalModeController`.

Se aplicó un refactor de input post-Milestone 5.1: `keyboardInput` quedó como factory pública, `keyboardKeyState` contiene tracking físico/visual y toggle táctico, y `keyboardSnapshot` construye el snapshot visual del teclado.

Se aplicó un refactor de UI post-HUD extendido: `hudUi` quedó como orquestador DOM, `hudLayout` contiene template/configuración del HUD, y `hudUpdate` contiene helpers de actualización visual, incluyendo cursor custom y anillo radial de acción.

Todavía no hay conjuros, menú táctico con botones de acción, inventario, cámara compleja, assets externos, guardado, multiplayer ni servidor.

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

- `AttackCommand`: command mínimo para solicitar ataque melee desde la acción primaria del jugador.

## Events existentes

Ninguno.

## Reglas puras existentes

- `damageRules`: contiene cálculo de daño mitigado y aplicación de daño a `Health`.
- `attackRules`: contiene regla pura mínima para calcular rango de ataque entre colliders.
- `geometryRules`: contiene helpers geométricos puros compartidos, como centro de rectángulo y distancia entre rectángulos.

## Input existente

- Input de teclado mínimo para movimiento con WASD y flechas.
- `keyboardInput`: factory pública que expone `getMovementIntent`, `consumeTacticalToggleIntent` y `getSnapshot`.
- `keyboardKeyState`: tracking de teclas físicas, teclas visuales y toggle táctico de `Space`.
- `keyboardSnapshot`: construcción del snapshot visual de teclado para HUD.
- Input de teclado expone snapshot visual por letra de movimiento (`W`, `A`, `R`, `S`) y snapshot visual de `Q`, `F`, `Tab` y `Space`.
- Input de teclado expone `consumeTacticalToggleIntent()` para alternar pausa táctica con `Space` en keydown inicial.
- Input de mouse para acción primaria con click izquierdo.
- Input de mouse expone snapshot visual de `LMB`, `RMB`, `M4`, `M5`, dirección/pulso de rueda, índice circular de rueda `0..9` y posición actual del puntero.
- Input produce movement intent y primary click intent.
- Input no modifica ECS ni componentes.
- Input no aplica daño.

## UI existente

- `hudUi`: orquesta nodos DOM del HUD y delega layout/update en módulos específicos.
- `hudLayout`: contiene template/configuración del HUD de teclado, mouse, rueda, pausa, cursor custom y debug panel.
- `hudUpdate`: contiene helpers para actualizar key caps, mouse caps, feedback de rueda, estado táctico, cursor custom y anillo radial de acción.
- `buildUiSnapshot`: construye un snapshot simple para UI con input, estado táctico, último command, estado de acción del jugador, duración de fase y progreso de fase.
- La UI no modifica ECS ni llama sistemas de simulation.

## App helpers existentes

- `createGameApp`: coordina creación de mundo, input, renderer, UI, entidades iniciales, game loop, simulation step, render, modo táctico y snapshot UI.
- `commandMapper`: convierte input de app en commands mínimos, actualmente click izquierdo en `AttackCommand`.
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
- `src/domain/rules/damageRules.js`
- `src/domain/rules/attackRules.js`
- `src/domain/rules/geometryRules.js`
- `src/game/createPlayer.js`
- `src/game/createEnemy.js`
- `src/game/playerQueries.js`
- `src/game/buildUiSnapshot.js`
- `src/input/keyboardInput.js`
- `src/input/keyboardKeyState.js`
- `src/input/keyboardSnapshot.js`
- `src/input/mouseInput.js`
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
- `src/ui/hudUi.js`
- `src/ui/hudLayout.js`
- `src/ui/hudUpdate.js`
- `src/render/canvasRenderer.js`
- `src/render/drawMap.js`
- `src/render/drawEntities.js`

## Próximo objetivo

Milestone 5.2 o refactor previo: decidir si conviene agregar panel táctico real, cancelar acción preparada, o dividir `style.css` antes de seguir ampliando UI.

## Riesgos actuales

- La IA persigue en línea recta y no tiene pathfinding.
- La IA detecta por distancia y facción, no por línea de visión.
- La muerte del jugador remueve la entidad sin pantalla de derrota.
- El click izquierdo queda definido como acción primaria del modo de juego; cuando exista inventario/UI interactiva, la capa app/UI deberá poder capturar clicks para no enviarlos como comandos de combate.
- `movementIntent` sigue entrando crudo a `runSimulationStep`; es deuda aceptada para movimiento continuo y no debe confundirse con un flujo totalmente command-driven.
- No existe command buffer; solo hay command mínimo directo por frame y un command táctico pendiente máximo en app/session.
- No existe event bus ni events.
- `createGameApp` sigue siendo el punto de presión de app/session; si crece el modo táctico, conviene extraer más coordinación.
- `style.css` supera 100 líneas y concentra estilos base, canvas, HUD, cursor, wheel feedback, key caps, estado táctico y debug panel; conviene dividirlo en un scope futuro cuando exista estrategia clara de CSS.
- `mouseInput.js` está cerca de 100 líneas y acumula click primario, botones extra, rueda y posición de puntero; aún aceptable, pero conviene vigilarlo si el mouse empieza a producir acciones reales.
- Sobrecargar el ECS mínimo antes de necesitar command buffer o event bus.
- Crear lógica de juego dentro de input o render.
- Pedir a la IA implementaciones grandes sin scope.

## Decisiones recientes

- Se corrigió el cursor custom para posicionarse con `left/top` desde JS y centrarse con `transform: translate(-50%, -50%)` desde CSS.
- Se agregó cursor custom tipo `+` como overlay DOM y se ocultó el cursor nativo sobre el juego.
- Se agregó anillo radial alrededor del cursor para representar `windup` y `recovery` del jugador controlado.
- El progreso radial se calcula desde `ActionEconomy.timeRemaining` y duración de fase derivada de `AttackProfile`/`pendingAttack`, sin timers propios en UI.
- `keyboardInput.js` fue dividido para quedar por debajo de 100 líneas y separar tracking de teclado, snapshot visual y API pública.
- `keyboardKeyState.js` contiene tracking físico/visual de teclado y el toggle táctico consumible.
- `keyboardSnapshot.js` construye el snapshot visual usado por el HUD.
- El indicador externo de `Wheel` con número/dirección quedó oculto temporalmente por CSS para no romper la silueta del mouse HUD.
- `LMB` y `RMB` recuperaron tamaño visual amplio mediante columnas más anchas en la grilla del mouse.
- Se reorganizó visualmente el HUD: teclado abajo izquierda; mouse y rueda abajo derecha.
- La banda superior ahora muestra solo `Pausa` y solo durante `tacticalPaused`.
- El layout del mouse usa grilla 3x3: `LMB` fila 1 columna 2, `RMB` fila 1 columna 3, `M5` fila 2 columna 1, `Wheel` fila 2 columnas 2-3, `M4` fila 3 columna 1.
- Milestone 5.1 implementó pausa táctica mínima con `Space`.
- La pausa táctica vive en app/session mediante `tacticalModeController`, no en ECS ni simulation.
- Mientras está en `tacticalPaused`, `createGameApp` no llama `runSimulationStep`.
- `LMB` en running conserva ataque inmediato; `LMB` en `tacticalPaused` prepara un `AttackCommand` pendiente.
- Al salir de pausa, se libera como máximo un command pendiente hacia simulation.
- Se dividió `hudUi` en `hudLayout` y `hudUpdate` para reducir complejidad y preparar UI futura.
- `hudUi` queda como orquestador DOM: inyecta template, cachea nodos y delega actualización.
- El rodillo mantiene un índice circular `0..9`: `deltaY < 0` incrementa y `deltaY > 0` decrementa, con wrap entre `0` y `9`.
- ECS será la fuente de verdad para entidades dinámicas.
- El combate será en tiempo real pausado, no por turnos clásicos.
- No se usará CA como defensa central.
- Armadura mitigará daño.
- Destreza no dará evasión pasiva universal.
- Descansos y rituales largos serán time-skips.
- No habrá multiplayer en la demo inicial.

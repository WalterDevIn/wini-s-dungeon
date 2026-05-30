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

La UI tiene una hotbar visual mínima centrada abajo con tres modos visuales: `inventory`, `spells` y `features`. El modo inicial es `inventory`: muestra 10 slots vacíos agrupados de a 2 en 5 pares y la selección visual deriva de `snapshot.input.mouse.wheelIndex` mediante pares `0-1`, `2-3`, `4-5`, `6-7`, `8-9`. Al presionar `Q`, la UI alterna visualmente entre `inventory` y `spells`; al presionar `F`, alterna visualmente entre `inventory` y `features`. Los modos `spells` y `features` muestran los 10 slots vacíos como slots individuales y seleccionan el slot individual `0..9` derivado de `mouse.wheelIndex`. El feedback de selección ahora es crecimiento rápido del par o slot seleccionado, no un marco como señal principal. No existe inventario real, items, conjuros reales, feats/features reales, `CastCommand`, `UseFeatureCommand`, spell registry, uso de objetos ni selección por números todavía.

El cursor nativo está oculto sobre el juego y la UI muestra un cursor custom tipo `+` como overlay DOM. Durante `windup` y `recovery`, la UI muestra un anillo radial alrededor del cursor usando el progreso derivado de `ActionEconomy` y `AttackProfile`; esto no modifica daño, tiempos ni reglas de combate. El cursor custom se posiciona con `left/top` desde JS y mantiene el centrado con CSS.

`main.js` quedó reducido a bootstrap. La coordinación de app/session, creación de mundo, input, renderer, UI, loop, simulation, render y snapshot vive en `createGameApp`. La conversión de input a command vive en `commandMapper`. El estado de pausa táctica vive en `tacticalModeController`.

El input de mouse se registra sobre `window` desde `createGameApp` para que el cursor custom, feedback de botones, wheel y click izquierdo sigan respondiendo aunque el overlay/UI o el escalado visual del canvas interfieran con eventos directos sobre el canvas.

Se aplicó un refactor de input post-Milestone 5.1: `keyboardInput` quedó como factory pública, `keyboardKeyState` contiene tracking físico/visual y toggle táctico, y `keyboardSnapshot` construye el snapshot visual del teclado. También `mouseInput` quedó como factory pública, mientras `mouseButtonState`, `mouseWheelState` y `mousePointerState` separan botones, rueda y puntero.

Se aplicó un refactor de UI post-HUD extendido: `hudUi` quedó como orquestador DOM, `hudLayout` contiene template/configuración del HUD, y `hudUpdate` contiene helpers de actualización visual, incluyendo cursor custom, anillo radial de acción y hotbar visual mínima. El estado visual de modo de hotbar vive en `quickBarViewState`, dentro de UI, y no es estado de gameplay.

Se aplicó un refactor CSS: `style.css` quedó como entrypoint con `@import`, y los estilos de UI se dividieron por responsabilidad en `src/ui/styles/`.

Todavía no hay conjuros reales, Firebolt, `CastCommand`, proyectiles, feats/features reales, `UseFeatureCommand`, menú táctico con botones de acción, inventario real, cámara compleja, assets externos, guardado, multiplayer ni servidor.

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
- Input de mouse para acción primaria con click izquierdo, registrado sobre `window` desde app.
- `mouseInput`: factory pública que expone `consumePrimaryClickIntent` y `getSnapshot`.
- `mouseButtonState`: tracking de botones y click primario consumible.
- `mouseWheelState`: tracking de rueda, índice circular `0..9`, dirección y pulso.
- `mousePointerState`: tracking de posición del puntero.
- Input no modifica ECS ni componentes.
- Input no aplica daño.

## UI existente

- `hudUi`: orquesta nodos DOM del HUD y delega layout/update en módulos específicos.
- `hudLayout`: contiene template/configuración del HUD de teclado, mouse, rueda, pausa, cursor custom, hotbar visual y debug panel.
- `hudUpdate`: contiene helpers para actualizar key caps, mouse caps, feedback de rueda, estado táctico, cursor custom, anillo radial de acción y hotbar visual.
- `quickBarViewState`: contiene estado visual de UI para alternar hotbar entre `inventory`, `spells` y `features` con `Q`/`F` por flanco de presión.
- `buildUiSnapshot`: construye un snapshot simple para UI con input, estado táctico, último command, estado de acción del jugador, duración de fase y progreso de fase.
- La UI no modifica ECS ni llama sistemas de simulation.

## CSS existente

- `style.css`: entrypoint de estilos con imports modulares.
- `src/ui/styles/base.css`: base global, fuente, colores raíz y cursor nativo oculto.
- `src/ui/styles/canvas.css`: canvas fullscreen y raíz de UI.
- `src/ui/styles/cursor.css`: cursor custom y anillo radial de acción.
- `src/ui/styles/tacticalStatus.css`: etiqueta visual de pausa táctica.
- `src/ui/styles/quickBar.css`: hotbar visual mínima, modos visuales `inventory`/`spells`/`features` y feedback de selección por crecimiento.
- `src/ui/styles/inputHud.css`: HUD de teclado, mouse, rueda y key caps.
- `src/ui/styles/debugPanel.css`: panel de debug.

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
- `src/input/mouseButtonState.js`
- `src/input/mouseWheelState.js`
- `src/input/mousePointerState.js`
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
- `src/ui/quickBarViewState.js`
- `src/ui/styles/base.css`
- `src/ui/styles/canvas.css`
- `src/ui/styles/cursor.css`
- `src/ui/styles/tacticalStatus.css`
- `src/ui/styles/quickBar.css`
- `src/ui/styles/inputHud.css`
- `src/ui/styles/debugPanel.css`
- `src/render/canvasRenderer.js`
- `src/render/drawMap.js`
- `src/render/drawEntities.js`

## Próximo objetivo

Milestone 6: iniciar Firebolt/proyectiles solo después de definir scope pequeño para `Projectile`, `Lifetime`, `DamageOnHit`, movimiento, colisión, definición data-driven y `CastCommand`, evitando que el primer conjuro nazca hardcodeado.

## Riesgos actuales

- La IA persigue en línea recta y no tiene pathfinding.
- La IA detecta por distancia y facción, no por línea de visión.
- La muerte del jugador remueve la entidad sin pantalla de derrota.
- El click izquierdo queda definido como acción primaria del modo de juego; cuando exista inventario/UI interactiva, la capa app/UI deberá poder capturar clicks para no enviarlos como comandos de combate.
- `movementIntent` sigue entrando crudo a `runSimulationStep`; es deuda aceptada para movimiento continuo y no debe confundirse con un flujo totalmente command-driven.
- No existe command buffer; solo hay command mínimo directo por frame y un command táctico pendiente máximo en app/session.
- No existe event bus ni events.
- `createGameApp` sigue siendo el punto de presión de app/session; si crece el modo táctico, conviene extraer más coordinación.
- La hotbar visual deriva selección desde `wheelIndex`; es una solución provisional de UI, no una fuente de verdad de inventario, spellcasting ni features activables.
- El modo visual `spells` no representa conjuros reales, spell slots, prepared spells ni capacidad de lanzar conjuros.
- El modo visual `features` no representa feats/features reales, recursos, cooldowns ni capacidad de activar habilidades.
- Sobrecargar el ECS mínimo antes de necesitar command buffer o event bus.
- Crear lógica de juego dentro de input o render.
- Pedir a la IA implementaciones grandes sin scope.

## Decisiones recientes

- Se agregó modo visual `features` a la hotbar: `F` alterna entre `features` e `inventory` dentro de UI.
- La hotbar visual ahora tiene tres modos: `inventory`, `spells` y `features`.
- `Q` alterna entre `spells` e `inventory`; si la hotbar está en `features`, `Q` cambia a `spells`.
- `F` alterna entre `features` e `inventory`; si la hotbar está en `spells`, `F` cambia a `features`.
- La secuencia `Q`, luego `F`, luego `F` devuelve la hotbar a `inventory`.
- El modo `inventory` conserva 10 slots vacíos agrupados de a 2 en 5 pares.
- Los modos `spells` y `features` muestran 10 slots individuales vacíos.
- En `inventory`, la selección visual deriva de `mouse.wheelIndex` por pares `0-1`, `2-3`, `4-5`, `6-7`, `8-9`.
- En `spells` y `features`, la selección visual deriva de `mouse.wheelIndex` como slot individual `0..9`.
- El feedback de selección de hotbar pasó de marco/borde principal a crecimiento rápido mediante CSS `transform: scale(...)`.
- `Q` y `F` no lanzan conjuros, no activan features, no crean commands y no inician Milestone 6.
- No existe `CastCommand`, `UseFeatureCommand`, spell registry, prepared spells reales, feats/features reales ni Firebolt todavía.
- `quickBarViewState.js` contiene el estado visual de hotbar y vive en UI, no en app ni simulation.
- `style.css` fue dividido en módulos CSS por responsabilidad y quedó como entrypoint con `@import`.
- Se crearon módulos CSS en `src/ui/styles/`: `base.css`, `canvas.css`, `cursor.css`, `tacticalStatus.css`, `quickBar.css`, `inputHud.css` y `debugPanel.css`.
- Se simplificó la hotbar visual eliminando borde global, números sobre pares y borde visible de pares no seleccionados.
- Se agregó hotbar visual mínima de inventario rápido: 10 slots vacíos agrupados de a 2 en 5 pares.
- La selección de hotbar es provisional y visual: se deriva de `mouse.wheelIndex` sin crear inventario real ni controller app-level.
- No se implementó selección por números `1-5`; queda para un scope posterior.
- `mouseInput.js` fue dividido para separar botones, rueda y puntero, manteniendo la misma API pública y el mismo snapshot.
- `mouseButtonState.js` contiene tracking de botones y click primario consumible.
- `mouseWheelState.js` contiene rueda, dirección, pulso e índice circular `0..9`.
- `mousePointerState.js` contiene posición del puntero.
- `createGameApp` registra `createMouseInput(window)` para robustecer cursor custom, feedback de mouse, rueda y clicks.
- Se agregó cursor custom tipo `+` como overlay DOM y se ocultó el cursor nativo sobre el juego.
- Se agregó anillo radial alrededor del cursor para representar `windup` y `recovery` del jugador controlado.
- El progreso radial se calcula desde `ActionEconomy.timeRemaining` y duración de fase derivada de `AttackProfile`/`pendingAttack`, sin timers propios en UI.
- `keyboardInput.js` fue dividido para quedar por debajo de 100 líneas y separar tracking de teclado, snapshot visual y API pública.
- `keyboardKeyState.js` contiene tracking físico/visual de teclado y el toggle táctico consumible.
- `keyboardSnapshot.js` construye el snapshot visual usado por el HUD.
- El indicador externo de `Wheel` con número/dirección quedó oculto temporalmente por CSS para no romper la silueta del mouse HUD.
- `LMB` y `RMB` recuperaron tamaño visual amplio mediante columnas más anchas en la grilla del mouse.
- Se reorganizó visualmente el HUD: teclado abajo izquierda; mouse y rueda abajo derecha.
- La banda superior muestra solo `Pausa` y solo durante `tacticalPaused`.
- El layout del mouse usa grilla 3x3: `LMB` fila 1 columna 2, `RMB` fila 1 columna 3, `M5` fila 2 columna 1, `Wheel` fila 2 columnas 2-3, `M4` fila 3 columna 1.
- Milestone 5.1 implementó pausa táctica mínima con `Space`.
- La pausa táctica vive en app/session mediante `tacticalModeController`, no en ECS ni simulation.
- Mientras está en `tacticalPaused`, `createGameApp` no llama `runSimulationStep`.
- `LMB` en running conserva ataque inmediato; `LMB` en `tacticalPaused` prepara un `AttackCommand` pendiente.
- Al salir de pausa, se libera como máximo un command pendiente hacia simulation.
- ECS será la fuente de verdad para entidades dinámicas.
- El combate será en tiempo real pausado, no por turnos clásicos.
- No se usará CA como defensa central.
- Armadura mitigará daño.
- Destreza no dará evasión pasiva universal.
- Descansos y rituales largos serán time-skips.
- No habrá multiplayer en la demo inicial.

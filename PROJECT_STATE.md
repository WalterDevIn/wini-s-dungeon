# PROJECT_STATE

Este archivo resume el estado actual del proyecto para reducir dependencia del contexto del chat.

Debe actualizarse al terminar cada milestone o feature importante.

## Estado actual

Proyecto recién iniciado.

Todavía no hay código de producción.

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

## Próximo objetivo

Milestone 0: Boot del proyecto.

Crear:

- `index.html`
- `style.css`
- `src/app/main.js`
- game loop mínimo
- canvas funcionando
- dibujo de prueba

## Riesgos actuales

- Empezar por features complejas antes del core.
- Migrar código viejo sin revisar arquitectura.
- Crear lógica de juego dentro de UI o render.
- Pedir a la IA implementaciones grandes sin scope.
- Intentar hacer multiplayer o servidor demasiado pronto.

## Decisiones recientes

- ECS será la fuente de verdad para entidades dinámicas.
- El combate será en tiempo real pausado, no por turnos clásicos.
- No se usará CA como defensa central.
- Armadura mitigará daño.
- Destreza no dará evasión pasiva universal.
- Descansos y rituales largos serán time-skips.
- No habrá multiplayer en la demo inicial.
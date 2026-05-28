# ARCHITECTURE

## Principio central

El juego usa ECS como fuente de verdad para entidades dinámicas.

ECS significa:

- Entity: identificador único.
- Component: datos puros.
- System: lógica que procesa entidades con ciertos componentes.

La simulación debe ser independiente de UI, canvas, DOM e input físico.

## Capas principales

### `src/app/`

Inicializa la aplicación.

Responsabilidades:

- Crear canvas.
- Inicializar sistemas principales.
- Conectar input, UI, game loop y render.
- Arrancar el juego.

No debe contener reglas de combate, conjuros ni lógica de simulación.

### `src/ecs/`

Núcleo ECS genérico.

Responsabilidades:

- Crear entidades.
- Agregar/remover componentes.
- Consultar entidades por componentes.
- Manejar command buffer.
- Manejar event bus.

No debe conocer reglas del juego.

No debe importar `domain`, `simulation`, `render`, `ui`, `input` ni `world`.

### `src/domain/`

Define el vocabulario del juego.

Responsabilidades:

- Componentes del dominio.
- Commands.
- Events.
- Reglas puras.
- Tipos de daño.
- Estados/condiciones.
- Definiciones de economía de acciones.

No debe leer DOM ni canvas.

### `src/simulation/`

Contiene sistemas de simulación.

Responsabilidades:

- Movimiento.
- Cooldowns.
- Colisión.
- Combate.
- Proyectiles.
- Conjuros.
- IA.
- Vida/muerte.
- Descanso.
- Tiempo de juego.
- Duración de efectos.

No debe importar `ui` ni leer DOM.

No debe dibujar.

### `src/world/`

Contiene mapa y estructuras espaciales.

Responsabilidades:

- Tilemap.
- Colisión de tiles.
- Generación de mapa.
- Información de puertas/obstáculos.
- Grid de visión.
- Pathfinding grid.

El tilemap base puede vivir fuera del ECS por eficiencia.

Objetos dinámicos como puertas, cofres, trampas, luces móviles y zonas de efecto pueden ser entidades ECS.

### `src/input/`

Convierte input físico en intents.

Responsabilidades:

- Leer teclado.
- Leer mouse.
- Traducir input a intención jugable.
- No aplicar reglas.
- No causar daño.
- No crear proyectiles.

Ejemplo: puede producir `MoveIntent` o `CastSpellIntent`, pero no resolverlos.

### `src/ui/`

Interfaz de usuario.

Responsabilidades:

- Menú táctico.
- HUD.
- Lista de conjuros.
- Inventario visual.
- Botones.
- Feedback textual.

La UI solo emite intents/commands.

La UI no aplica daño, no consume recursos y no modifica componentes directamente.

### `src/render/`

Dibuja el estado del juego.

Responsabilidades:

- Canvas renderer.
- Cámara.
- Dibujar mapa.
- Dibujar entidades.
- Dibujar efectos visuales.
- Dibujar overlays.

Render solo lee snapshots o estado de solo lectura.

Render no modifica componentes.

### `src/content/`

Datos del juego.

Responsabilidades:

- Conjuros.
- Monstruos.
- Armas.
- Armaduras.
- Items.
- Tiles.
- Definiciones de clases si existen.

Debe tender a ser data-driven.

Una definición de contenido no debe leer DOM, input ni canvas.

### `src/save/`

Guardado y carga.

Responsabilidades:

- Serializar estado.
- Deserializar estado.
- Guardado local.
- Versionado de saves si hace falta.

### `src/tests/`

Pruebas.

Responsabilidades:

- Pruebas unitarias.
- Pruebas de humo.
- Tests de simulación sin UI.

## Flujo de datos

El flujo correcto es:

1. Input/UI produce intents.
2. Intents se convierten en commands.
3. La simulación valida commands.
4. Los sistemas ECS modifican componentes.
5. Los sistemas emiten events.
6. El juego construye snapshots.
7. Render/UI leen snapshots.
8. Render dibuja.

## Prohibiciones

Está prohibido:

- Que simulation lea DOM.
- Que render aplique reglas.
- Que UI cause daño directamente.
- Que input cree proyectiles directamente.
- Que un conjuro tenga su propio loop.
- Que una feature cree estado global sin aprobación.
- Que una feature duplique un sistema existente.
- Que un archivo mezcle UI, render y simulación.

## Regla de integración

Una feature solo entra al core si puede explicarse mediante:

- Componentes.
- Sistemas.
- Commands.
- Events.
- Datos de content.
- Tests o criterios de aceptación.

Si no puede explicarse así, debe tratarse primero como spike/prototipo.
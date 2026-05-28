# BOUNDARIES

Este archivo define fronteras entre módulos.

La arquitectura importa más que una feature individual.

## Dependencias permitidas

### `app/`

Puede importar:

- `ecs/`
- `game/`
- `input/`
- `ui/`
- `render/`
- `simulation/`
- `world/`
- `content/`
- `save/`

`app/` solo compone el programa. No contiene reglas.

### `ecs/`

Puede importar:

- Nada del juego.

`ecs/` debe ser genérico.

No puede importar:

- `app/`
- `game/`
- `domain/`
- `simulation/`
- `world/`
- `input/`
- `ui/`
- `render/`
- `content/`
- `save/`

### `domain/`

Puede importar:

- `ecs/` solo si es necesario para tipos o helpers genéricos.

No puede importar:

- `ui/`
- `render/`
- `input/`
- DOM
- canvas

### `simulation/`

Puede importar:

- `ecs/`
- `domain/`
- `world/`
- `content/`

No puede importar:

- `ui/`
- `render/`
- `input/`
- DOM
- canvas

### `world/`

Puede importar:

- `domain/` si necesita tipos.
- `ecs/` solo si interactúa con entidades dinámicas.

No puede importar:

- `ui/`
- `render/`
- DOM

### `input/`

Puede importar:

- `domain/commands` o tipos de intents si existen.

No puede importar:

- `simulation/`
- `render/`
- sistemas concretos de combate
- lógica de daño

### `ui/`

Puede importar:

- Tipos de commands/intents.
- Snapshots.
- Datos de content para mostrar información.

No puede importar:

- Sistemas de simulación.
- Lógica de daño.
- Lógica de colisión.

### `render/`

Puede importar:

- Snapshots.
- Assets.
- Datos visuales.
- `world/` solo para lectura de mapa.

No puede importar:

- Sistemas de simulación.
- Lógica de combate.
- UI.
- Input.

### `content/`

Puede importar:

- Helpers puros.
- Constantes de dominio.

No puede importar:

- `ui/`
- `render/`
- `input/`
- `simulation/`

### `save/`

Puede importar:

- `ecs/`
- `domain/`
- estructuras serializables.

No puede importar:

- `ui/`
- `render/`
- input físico.

## Reglas para features

Toda feature debe declarar:

- Qué carpeta es dueña de la lógica.
- Qué componentes usa.
- Qué sistemas usa.
- Qué commands recibe.
- Qué events emite.
- Qué archivos puede modificar.
- Qué archivos no puede modificar.

## Señales de violación arquitectónica

Una implementación es sospechosa si:

- Un botón de UI causa daño directamente.
- Un conjuro lee el mouse directamente.
- Un renderer cambia Health.
- Un sistema crea elementos DOM.
- Un enemigo tiene lógica metida en el archivo del jugador.
- Cada spell crea su propio sistema de colisión.
- Se crean estados globales para resolver una feature puntual.
- Se agregan flags especiales en muchos archivos sin modelo común.

## Regla de detención

Si una tarea requiere tocar archivos fuera del scope aprobado, la implementación debe detenerse y pedir autorización.
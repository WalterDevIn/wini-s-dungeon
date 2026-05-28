# GLOSSARY

Glosario técnico del proyecto.

## Entity

ID que representa algo dinámico del mundo.

Ejemplos:

- Jugador.
- Enemigo.
- Proyectil.
- Puerta.
- Cofre.
- Trampa.
- Zona de efecto.

Una entity no contiene lógica por sí misma.

## Component

Datos puros asociados a una entity.

Ejemplos:

- `Position`
- `Velocity`
- `Health`
- `Collider`
- `Projectile`
- `DamageOnHit`

Un component no debería tener lógica compleja.

## System

Lógica que procesa entidades con ciertos componentes.

Ejemplos:

- `movementSystem`
- `collisionSystem`
- `projectileSystem`
- `combatSystem`

Un system no debe depender de UI ni render.

## ECS

Entity Component System.

Arquitectura donde:

- Las entities son IDs.
- Los components son datos.
- Los systems contienen la lógica.

## Core

Núcleo estable del juego.

Incluye:

- ECS.
- Simulación.
- Reglas principales.
- Commands.
- Events.
- Sistemas centrales.

El core no debe depender de UI, DOM, canvas ni input físico.

## Boundary

Frontera entre módulos.

Ejemplo:

- UI no aplica daño.
- Render no modifica estado.
- Simulation no lee DOM.

## Command

Orden jugable que pide un cambio.

Ejemplos:

- `MoveCommand`
- `AttackCommand`
- `CastSpellCommand`
- `InteractCommand`

Un command puede ser validado, rechazado o aplicado por la simulación.

## Event

Hecho que ya ocurrió en la simulación.

Ejemplos:

- `DamageDealtEvent`
- `EntityKilledEvent`
- `ProjectileHitEvent`
- `DoorOpenedEvent`

Los events permiten que sistemas reaccionen sin estar acoplados entre sí.

## Intent

Intención cruda del jugador o la UI.

Ejemplo:

- El jugador apretó una tecla.
- El jugador eligió Firebolt en el menú.
- El jugador hizo click en una posición.

El intent todavía no es una acción válida. Debe convertirse en command y validarse.

## Snapshot

Foto de solo lectura del estado actual.

Render y UI pueden leer snapshots para dibujar o mostrar información.

No deben modificar la simulación.

## Data-driven

Diseño donde el contenido vive principalmente como datos.

Ejemplo:

Un conjuro se define con:

- Nombre.
- Coste.
- Alcance.
- Tipo de targeting.
- Efecto.
- Daño.
- Componentes que crea.

No como un archivo gigante con lógica especial.

## Vertical Slice

Mini versión jugable de punta a punta.

No es todo el juego. Es una rebanada pequeña que permite probar el flujo completo.

Ejemplo:

Mapa + jugador + enemigo + ataque + daño + muerte.

## Milestone

Etapa cerrada con resultado verificable.

Ejemplo:

Milestone 1 termina cuando el jugador se mueve y no atraviesa paredes.

## Scope

Alcance exacto de una tarea.

Define:

- Qué se va a hacer.
- Qué archivos se pueden tocar.
- Qué archivos no se pueden tocar.
- Qué queda fuera.

## Spike

Experimento técnico descartable.

Sirve para aprender si una idea funciona sin contaminar el core.

Un spike no es production code.

## Prototype

Prueba jugable o mecánica.

Puede ser descartable o evolucionar hacia producción, pero primero debe pasar por review.

## Production Code

Código que entra al juego real.

Debe respetar arquitectura, boundaries y decisiones del proyecto.

## Review

Revisión antes de aceptar una implementación.

Busca:

- Violaciones arquitectónicas.
- Duplicación.
- Burbujas de feature.
- Falta de tests.
- Mezcla indebida de UI/render/simulation.

## Backlog

Lista de ideas para después.

Una idea en backlog no debe implementarse hasta entrar en un milestone concreto.

## Guardrail

Regla protectora.

Ejemplo:

“Si una implementación necesita tocar archivos fuera del scope aprobado, debe detenerse y preguntar.”
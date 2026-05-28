# ROADMAP

Este roadmap define milestones pequeños y cerrados.

Cada milestone debe terminar con algo verificable.

## Milestone 0: Boot del proyecto

Objetivo:
Crear la aplicación mínima.

Incluye:

- Proyecto iniciado.
- `index.html`.
- `style.css`.
- `src/app/main.js`.
- Canvas funcionando.
- Game loop funcionando.
- Pantalla limpiándose cada frame.
- Dibujo de prueba.

Criterio de aceptación:
Al abrir el juego se ve el canvas y un objeto simple dibujado.

## Milestone 1: Movimiento y colisión

Objetivo:
Tener jugador moviéndose en un mapa pequeño.

Incluye:

- ECS mínimo.
- Entidad jugador.
- Componentes `Position`, `Velocity`, `Renderable`, `Collider`, `MovementStats`.
- Tilemap simple.
- Colisión contra paredes.
- Cámara básica si hace falta.

Criterio de aceptación:
El jugador puede moverse y no atraviesa paredes.

## Milestone 2: Vida, daño y enemigo básico

Objetivo:
Introducir criaturas y daño.

Incluye:

- `Health`.
- `Creature`.
- `Faction`.
- Enemigo quieto.
- Ataque de prueba.
- Muerte de entidad.

Criterio de aceptación:
El jugador puede dañar un enemigo y el enemigo puede morir.

## Milestone 3: Combate melee en tiempo real

Objetivo:
Hacer combate básico jugable.

Incluye:

- `ActionEconomy`.
- Cooldown de ataque.
- `AttackProfile`.
- `DefenseProfile`.
- `DamageReduction`.
- Hitbox o alcance melee.
- Feedback mínimo.

Criterio de aceptación:
El jugador puede atacar con ritmo limitado y el enemigo recibe daño solo cuando corresponde.

## Milestone 4: IA simple

Objetivo:
Agregar enemigo que persigue y ataca.

Incluye:

- `AIControlled`.
- Sistema de persecución simple.
- Ataque enemigo.
- Faction filtering.

Criterio de aceptación:
Un enemigo detecta al jugador, se acerca y ataca.

## Milestone 5: Menú táctico pausado

Objetivo:
Permitir elegir acciones sin memorizar teclas.

Incluye:

- Capa UI.
- Pausa táctica single-player.
- Botones de acción.
- Intent/command al confirmar acción.
- Separación entre UI y simulation.

Criterio de aceptación:
Abrir el menú pausa la simulación, permite elegir una acción y al cerrar se ejecuta mediante command.

## Milestone 6: Proyectiles genéricos y Firebolt

Objetivo:
Implementar el primer conjuro sin crear burbuja.

Incluye:

- `Projectile`.
- `Lifetime`.
- `DamageOnHit`.
- Movimiento de proyectiles.
- Colisión de proyectiles.
- Definición data-driven de Firebolt.
- Cast command.

Criterio de aceptación:
Firebolt se lanza, viaja, choca con pared o enemigo, hace daño y expira.

## Milestone 7: Puertas y visión

Objetivo:
Agregar exploración táctica.

Incluye:

- Puertas como entidades o tiles interactivos.
- `Interactable`.
- Línea de visión básica.
- Zonas exploradas/visibles.
- Ver parcialmente más allá de puertas si se decide.

Criterio de aceptación:
El jugador puede abrir puertas y la visibilidad del mapa responde correctamente.

## Milestone 8: Descanso y tiempo largo

Objetivo:
Agregar recuperación con riesgo.

Incluye:

- `GameClock`.
- Descanso corto o largo.
- Validación de zona segura.
- Time-skip.
- Consumo simple de recurso si aplica.
- Consecuencia mínima.

Criterio de aceptación:
El jugador puede descansar solo si las condiciones lo permiten y el juego avanza el tiempo internamente.

## Milestone 9: Mini rogue jugable

Objetivo:
Cerrar una demo pequeña.

Incluye:

- Inicio.
- Mazmorra pequeña.
- Enemigos.
- Combate.
- Un conjuro.
- Descanso.
- Puertas/visión.
- Muerte.
- Victoria o salida.

Criterio de aceptación:
Se puede jugar una partida corta de principio a fin.
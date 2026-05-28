# VISION

## Qué juego estoy haciendo

Un action RPG top-down de mazmorra, con combate en tiempo real pausado, movimiento físico, conjuros y reglas tácticas inspiradas en DnD, construido con ECS y pensado inicialmente como una demo rogue pequeña.

El juego combina:

- Exploración top-down.
- Movimiento fluido en tiempo real.
- Combate táctico con pausa en single-player.
- Reglas inspiradas en DnD, pero adaptadas a videojuego.
- Entidades dinámicas controladas por ECS.
- Conjuros físicos, proyectiles, áreas, cooldowns y recursos.
- Mazmorras pequeñas con puertas, visión, enemigos, descanso y riesgo.

El objetivo inicial no es hacer un mundo abierto completo ni una adaptación total de DnD. El objetivo inicial es crear una demo pequeña, coherente y mantenible.

## Fantasía principal

El jugador explora una mazmorra peligrosa con un personaje de fantasía, toma decisiones tácticas mediante un menú pausado, usa movimiento real para posicionarse y esquivar, y emplea habilidades/conjuros inspirados en DnD.

## Qué NO estoy haciendo todavía

La demo inicial no incluye:

- Multiplayer.
- Servidor autoritativo.
- Creación completa de personaje DnD.
- Todas las razas y clases.
- Todos los conjuros.
- Crafting complejo.
- Construcción tipo Terraria completa.
- Mundo abierto persistente.
- Sistema de DM.
- Economía compleja.
- NPCs sociales complejos.
- Procedural generation avanzada.

Estas ideas pueden existir en el backlog, pero no son parte del objetivo inicial.

## Demo objetivo

La primera demo debe incluir:

- Mapa pequeño.
- Jugador.
- Movimiento fluido.
- Colisión con paredes.
- Enemigos simples.
- Vida y daño.
- Ataque melee básico.
- Cooldowns.
- Menú táctico pausado.
- Al menos un proyectil/conjuro, como Firebolt.
- Puertas.
- Línea de visión básica.
- Descanso corto o largo simplificado.
- Condición de victoria o salida de mazmorra.

## Principio rector

Cada feature debe ser una composición de componentes, sistemas, commands y events existentes o claramente justificados.

Si una feature necesita inventar una burbuja propia, la arquitectura todavía no está lista para esa feature.
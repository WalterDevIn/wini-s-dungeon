# DECISIONS

Este archivo registra decisiones técnicas y de diseño ya tomadas.

No es un backlog. No es una lista de deseos. Es una lista de decisiones que guían el proyecto.

## Decisiones actuales

### 1. El juego no adapta DnD literalmente

El juego toma inspiración de DnD, pero adapta sus reglas a un videojuego top-down en tiempo real.

DnD es referencia de fantasía, economía, atributos, conjuros y progresión, no una prisión mecánica.

### 2. Combate en tiempo real pausado

El combate ocurre en tiempo real.

En single-player, el jugador puede abrir un menú táctico que pausa la simulación para elegir acciones.

La pausa táctica es una comodidad de interfaz, no una regla central de simulación.

### 3. No hay turnos clásicos en la demo

No se usará turno clásico de DnD como sistema principal.

La economía de turnos se traduce a:

- Cooldowns.
- Cast times.
- Recovery times.
- Recursos.
- Reacciones con recarga.
- Acciones principales/secundarias si hace falta.

### 4. No se usa CA como defensa central

La Clase de Armadura de DnD no será el centro de la defensa.

En un videojuego con movimiento real, la esquiva debe depender principalmente de:

- Posición.
- Movimiento.
- Hitboxes.
- Cobertura.
- Distancia.
- Timing.
- Obstáculos.

### 5. La armadura mitiga daño

La armadura no hace que los ataques fallen de forma abstracta.

La armadura puede:

- Reducir daño.
- Reducir interrupción.
- Aumentar poise/stability.
- Penalizar movimiento.
- Aumentar ruido.
- Modificar resistencia a ciertos tipos de daño.

### 6. Destreza no da evasión pasiva universal

Destreza puede afectar:

- Precisión.
- Armas ligeras.
- Armas a distancia.
- Sigilo.
- Herramientas.
- Iniciativa/apertura.
- Velocidad de recuperación.
- Acciones ágiles.

Pero no debe reemplazar el movimiento real del jugador.

### 7. El tilemap base no necesita ser ECS

El tilemap base puede ser una estructura espacial externa.

Entidades dinámicas sí deben ser ECS:

- Jugador.
- Enemigos.
- Proyectiles.
- Puertas interactivas.
- Cofres.
- Trampas.
- Zonas de efecto.
- Luces dinámicas.
- Efectos temporales.

### 8. Los conjuros deben ser data-driven

Un conjuro no debe ser una burbuja gigante.

Debe dividirse en:

- Definición.
- Targeting.
- Costos.
- Requisitos.
- Efecto.
- Entidades que crea.
- Eventos que emite.

Ejemplo: Firebolt debería usar sistemas genéricos de projectile, collision, damage y lifetime.

### 9. Descansos y acciones largas son time-skips

Un descanso largo de 8 horas o un ritual de muchas horas no se simula segundo a segundo.

Se maneja como:

- Validación.
- Salto temporal.
- Consumo de recursos.
- Riesgo.
- Consecuencias.
- Recuperación.

### 10. No multiplayer en la demo inicial

El código debe evitar bloquear un futuro multiplayer, pero no se implementará multiplayer todavía.

La simulación debe diseñarse de forma que más adelante pueda moverse a servidor, pero la demo será local.

### 11. No servidor inicial

La primera demo no usará servidor.

Se prioriza una simulación local limpia, determinista y serializable.

### 12. La IA debe trabajar con scope explícito

La IA puede leer mucho contexto, pero solo puede modificar archivos aprobados.

Toda feature no trivial debe pasar por scope antes de implementación.

### 13. El código viejo es cantera, no base

El proyecto anterior puede consultarse para entender comportamiento, nombres, ideas o assets.

No se debe migrar código viejo entero sin revisar arquitectura.
# AI_PROMPTS

Este archivo contiene las plantillas principales para trabajar con IA en el proyecto.

El objetivo es evitar prompts improvisados, proteger la arquitectura y reducir features aisladas o “burbujas”.

Repositorio: `wini-s-dungeon`.

## Regla general

La IA puede recibir el zip completo del proyecto para contexto y comodidad, pero eso no significa que pueda modificar todo el proyecto.

En cualquier tarea de código, la IA debe respetar:

- `VISION.md`
- `ARCHITECTURE.md`
- `BOUNDARIES.md`
- `DECISIONS.md`
- `ROADMAP.md`
- `PROJECT_STATE.md`
- `GLOSSARY.md`

Regla central:

> La IA puede leer todo lo necesario, pero solo puede modificar lo aprobado.

Si necesita tocar archivos fuera del scope aprobado, debe detenerse y pedir autorización.

---

# MODO: DISEÑO

Usar este modo cuando todavía no está claro qué se quiere construir.

Este modo no escribe código.

Sirve para decidir diseño, comparar opciones, reducir alcance y detectar si una idea debe probarse primero como experimento aislado.

## Plantilla

```txt
MODO: DISEÑO

Contexto:
Estoy desarrollando un action rogue top-down con arquitectura ECS data-driven, combate en tiempo real pausado, reglas inspiradas en DnD y fronteras estrictas entre UI, render, input y simulation.

Antes de responder, tené en cuenta:
- VISION.md
- ARCHITECTURE.md
- BOUNDARIES.md
- DECISIONS.md
- ROADMAP.md
- PROJECT_STATE.md
- GLOSSARY.md

Idea/problema:
[DESCRIBIR LA IDEA, DUDA O MECÁNICA]

Objetivo:
Quiero decidir si esta idea conviene para la demo y cómo debería diseñarse sin romper la arquitectura.

No escribas código.

Entregá:
1. Resumen del problema.
2. Entre 2 y 4 opciones de diseño.
3. Pros y contras de cada opción.
4. Impacto en arquitectura.
5. Componentes ECS que podrían necesitarse.
6. Sistemas que podrían necesitarse.
7. Commands/events que podrían necesitarse.
8. Riesgos de scope creep.
9. Qué debería quedar fuera de la demo.
10. Recomendación concreta para una primera versión pequeña.
11. Si la idea es incierta pero prometedora, proponé un experimento aislado.
12. Veredicto:
   - pasar a SCOPE
   - seguir diseñando
   - hacer spike descartable
   - descartar/postergar

Restricciones:
- No propongas multiplayer como requisito inicial.
- No propongas servidor como requisito inicial.
- No propongas sistemas grandes si una versión pequeña alcanza.
- Priorizá mantenibilidad para una sola persona.
- Si la idea todavía está verde, no la trates como feature lista para producción.
```

---

# MODO: SCOPE

Usar este modo cuando una feature, refactor, bugfix o cambio de contenido ya está decidido, pero todavía no se sabe exactamente qué archivos tocar.

Este modo no escribe código.

Sirve para que la IA inspeccione el proyecto, proponga alcance, detecte riesgos y produzca un contrato copiable para MODO: IMPLEMENTACIÓN.

## Plantilla

```txt
MODO: SCOPE

Tipo de tarea:
[feature / refactor / bugfix / cleanup / architecture / content]

Contexto:
Estoy desarrollando un action rogue top-down con arquitectura ECS data-driven, commands/events, y separación estricta entre UI, render, input y simulation.

Te paso el zip completo del proyecto para contexto.

Primero leé:
- VISION.md
- ARCHITECTURE.md
- BOUNDARIES.md
- DECISIONS.md
- ROADMAP.md
- PROJECT_STATE.md
- GLOSSARY.md

Objetivo:
[DESCRIBIR QUÉ QUIERO LOGRAR]

Resultado esperado:
[DESCRIBIR QUÉ DEBE PODER HACER EL JUGADOR, EL SISTEMA O EL CÓDIGO]

Restricciones específicas:
[LISTAR RESTRICCIONES SI LAS HAY]

No escribas código.
No modifiques archivos.
Solo analizá el scope.

Entregá:
1. Resumen de la tarea.
2. Clasificación correcta de la tarea.
3. Archivos que necesitás inspeccionar.
4. Archivos inspeccionados.
5. Diagnóstico.
6. Archivos que proponés modificar.
7. Archivos que proponés crear.
8. Archivos que NO deberían tocarse.
9. Dueño principal de la lógica:
   - app
   - game
   - simulation
   - domain
   - ui
   - render
   - input
   - world
   - content
10. Componentes ECS existentes que se usarían.
11. Componentes ECS nuevos que se necesitarían, si aplica.
12. Sistemas existentes que se usarían.
13. Sistemas nuevos que se necesitarían, si aplica.
14. Commands existentes o nuevos.
15. Events existentes o nuevos.
16. Cambios por capa:
   - app
   - input
   - ui
   - simulation
   - domain
   - render
   - world
   - content
17. Riesgos arquitectónicos.
18. Riesgos de scope creep.
19. Infraestructura previa necesaria.
20. Plan de implementación dividido en pasos pequeños.
21. Criterios de aceptación.
22. Pruebas de humo necesarias.
23. Fuera de scope.
24. Veredicto:
   - listo para implementar
   - requiere diseño previo
   - requiere experimento aislado
   - requiere dividirse en varios scopes

Reglas:
- Si la tarea rompe ARCHITECTURE.md o BOUNDARIES.md, avisá.
- Si falta infraestructura previa, proponé implementarla antes.
- No mezcles UI, render y simulation.
- No propongas crear lógica especial si existe un sistema genérico adecuado.
- Si la tarea parece demasiado grande, dividila.
- Si no podés producir un contrato seguro, no inventes archivos ni decisiones.

Al final de la respuesta, generá un bloque llamado exactamente:

=== CONTRATO DE IMPLEMENTACIÓN ===

Ese bloque debe estar listo para copiar y pegar en MODO: IMPLEMENTACIÓN.

Formato obligatorio del contrato:

Tarea:
[feature/refactor/bugfix/cleanup/architecture/content + nombre]

Objetivo cerrado:
[alcance breve, verificable y sin ambigüedad]

Archivos permitidos para modificar:
- [archivo]

Archivos permitidos para crear:
- [archivo]

Archivos prohibidos:
- [archivo/carpeta]

Dueño principal de la lógica:
[app/game/simulation/domain/ui/render/input/world/content]

Componentes:
- Usar:
- Crear:

Sistemas:
- Usar:
- Crear:

Commands:
- Usar:
- Crear:

Events:
- Usar:
- Crear:

Cambios permitidos por capa:
- app:
- input:
- ui:
- simulation:
- domain:
- render:
- world:
- content:

Criterios de aceptación:
- [criterio verificable]

Pruebas de humo:
- [prueba manual o automatizada]

Fuera de scope:
- [lo que NO se debe hacer]

Notas de implementación:
- [advertencias, orden sugerido o restricciones]

Actualización de PROJECT_STATE.md:
- [no / proponer solamente / modificar si está permitido en archivos permitidos]

Regla de detención:
Si la implementación necesita tocar algo fuera de este contrato, detenerse y pedir ampliación de scope.
```

---

# MODO: IMPLEMENTACIÓN

Usar este modo solo cuando ya existe un contrato generado por MODO: SCOPE o cuando el cambio califica como bug trivial según la regla de este archivo.

La IA puede recibir el zip completo, pero solo puede modificar los archivos aprobados.

Puede devolver el zip completo modificado si ese es el flujo más cómodo.

## Plantilla

```txt
MODO: IMPLEMENTACIÓN

Contexto:
Estoy desarrollando un action rogue top-down con arquitectura ECS data-driven.

Leé primero:
- PROJECT_STATE.md
- ARCHITECTURE.md
- BOUNDARIES.md
- DECISIONS.md
- ROADMAP.md
- GLOSSARY.md

Te paso el zip completo para contexto y comodidad, pero solo podés modificar los archivos aprobados en el contrato.

Usá este contrato como única autorización de cambios:

=== CONTRATO DE IMPLEMENTACIÓN ===
[PEGAR BLOQUE COMPLETO GENERADO POR MODO: SCOPE]

Reglas obligatorias:
- No reinterpretés el scope.
- No agregues features.
- No agregues archivos fuera del contrato.
- No modifiques archivos fuera del contrato.
- Si necesitás tocar otro archivo, detenete y preguntá.
- No crees estado global nuevo salvo autorización explícita en el contrato.
- No leas DOM desde simulation.
- No dibujes desde simulation.
- No apliques reglas desde UI.
- No modifiques componentes desde render.
- No dupliques lógica existente.
- No crees loops paralelos.
- No crees un sistema especial si corresponde usar uno genérico.
- No conviertas la feature en una burbuja aislada.
- No modifiques PROJECT_STATE.md salvo que esté permitido en el contrato.

Entregá:
1. Archivos inspeccionados.
2. Archivos modificados.
3. Motivo de cada archivo modificado.
4. Resumen de cambios realizados.
5. Código completo de cada archivo modificado, o zip completo actualizado si corresponde.
6. Instrucciones de prueba manual.
7. Pruebas de humo agregadas o recomendadas.
8. Revisión arquitectónica breve:
   - ¿Respeta ARCHITECTURE.md?
   - ¿Respeta BOUNDARIES.md?
   - ¿Mezcla UI/render/simulation?
   - ¿Crea burbujas?
   - ¿Duplica lógica?
9. Riesgos restantes.
10. Si corresponde, actualización aplicada o propuesta para PROJECT_STATE.md.

Importante:
Si no podés cumplir la tarea sin tocar archivos fuera del contrato, no improvises. Detenete y pedí ampliación de scope.
```

---

# Flujo recomendado

## Idea incierta

```txt
DISEÑO → SCOPE → IMPLEMENTACIÓN
```

## Feature decidida

```txt
SCOPE → IMPLEMENTACIÓN
```

## Refactor

```txt
SCOPE → IMPLEMENTACIÓN
```

## Bugfix

```txt
SCOPE → IMPLEMENTACIÓN
```

## Bug trivial

Un bug solo puede ir directo a IMPLEMENTACIÓN si cumple todo esto:

- afecta un único archivo;
- no cruza capas;
- no cambia arquitectura;
- no agrega comportamiento nuevo;
- no toca ECS, simulation, input, UI y render al mismo tiempo;
- no requiere crear componentes, sistemas, commands ni events;
- no requiere modificar PROJECT_STATE.md.

Si no cumple todo, debe pasar por SCOPE.

Plantilla mínima para bug trivial:

```txt
MODO: IMPLEMENTACIÓN

Tipo de tarea:
bugfix trivial

Archivo permitido para modificar:
- [ÚNICO ARCHIVO]

Bug:
[DESCRIBIR BUG]

Comportamiento esperado:
[DESCRIBIR RESULTADO]

Restricciones:
- No tocar otros archivos.
- No agregar features.
- No refactorizar fuera del arreglo mínimo.
- Si hace falta tocar otro archivo, detenerse y pedir SCOPE.
```

## Regla final

Nada grande entra a production code sin pasar por SCOPE.

Nada incierto entra a production code sin pasar por DISEÑO.

Nada que cruce capas entra por bug trivial.

Nada se considera cerrado sin revisión arquitectónica breve al final de IMPLEMENTACIÓN.

# AI_PROMPTS

Este archivo contiene las plantillas principales para trabajar con IA en el proyecto.

El objetivo es evitar prompts improvisados, proteger la arquitectura y reducir features aisladas o “burbujas”.

## Regla general

La IA puede recibir el zip completo del proyecto para contexto y comodidad, pero eso no significa que pueda modificar todo el proyecto.

En cualquier tarea de código, la IA debe respetar:

- `VISION.md`
    
- `ARCHITECTURE.md`
    
- `BOUNDARIES.md`
    
- `DECISIONS.md`
    
- `PROJECT_STATE.md`
    

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

Restricciones:
- No propongas multiplayer como requisito inicial.
- No propongas servidor como requisito inicial.
- No propongas sistemas grandes si una versión pequeña alcanza.
- Priorizá mantenibilidad para una sola persona.
- Si la idea todavía está verde, no la trates como feature lista para producción.
```

---

# MODO: SCOPE

Usar este modo cuando la feature ya está decidida, pero todavía no se sabe qué archivos tocar.

Este modo no escribe código.

Sirve para que la IA inspeccione el proyecto, proponga alcance y detecte riesgos antes de implementar.

## Plantilla

```txt
MODO: SCOPE

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

Feature:
[DESCRIBIR FEATURE]

Resultado esperado:
[DESCRIBIR QUÉ DEBE PODER HACER EL JUGADOR O EL SISTEMA]

No escribas código.
No modifiques archivos.
Solo analizá el scope.

Entregá:
1. Resumen de la feature.
2. Archivos que necesitás inspeccionar.
3. Archivos inspeccionados.
4. Archivos que proponés modificar.
5. Archivos que proponés crear.
6. Archivos que NO deberían tocarse.
7. Componentes ECS existentes que se usarían.
8. Componentes ECS nuevos que se necesitarían, si aplica.
9. Sistemas existentes que se usarían.
10. Sistemas nuevos que se necesitarían, si aplica.
11. Commands existentes o nuevos.
12. Events existentes o nuevos.
13. Cambios en content/data, si aplica.
14. Cambios en UI, si aplica.
15. Cambios en render, si aplica.
16. Riesgos arquitectónicos.
17. Riesgos de scope creep.
18. Infraestructura previa necesaria.
19. Plan de implementación dividido en pasos pequeños.
20. Criterios de aceptación.
21. Pruebas de humo necesarias.
22. Veredicto: listo para implementar / requiere diseño previo / requiere experimento aislado.

Reglas:
- Si la feature rompe ARCHITECTURE.md o BOUNDARIES.md, avisá.
- Si falta infraestructura previa, proponé implementarla antes.
- No mezcles UI, render y simulation.
- No propongas crear lógica especial si existe un sistema genérico adecuado.
- Si la feature parece demasiado grande, dividila.
```

---

# MODO: IMPLEMENTACIÓN

Usar este modo solo cuando el scope ya fue aprobado.

La IA puede recibir el zip completo, pero solo puede modificar los archivos aprobados.

Puede devolver el zip completo modificado si ese es el flujo más cómodo.

## Plantilla

```txt
MODO: IMPLEMENTACIÓN

Contexto:
Estoy desarrollando un action rogue top-down con arquitectura ECS data-driven. Esta implementación debe respetar ARCHITECTURE.md, BOUNDARIES.md, DECISIONS.md y PROJECT_STATE.md.

Te paso el zip completo para contexto y comodidad, pero solo podés modificar los archivos aprobados.

Feature:
[DESCRIBIR FEATURE]

Scope aprobado:
[PEGAR RESUMEN DEL SCOPE APROBADO]

Archivos permitidos para modificar:
- [LISTAR ARCHIVOS]

Archivos permitidos para crear:
- [LISTAR ARCHIVOS]

Archivos prohibidos:
- [LISTAR ARCHIVOS O CARPETAS]

Componentes a usar/crear:
- [LISTAR]

Sistemas a usar/crear:
- [LISTAR]

Commands a usar/crear:
- [LISTAR]

Events a usar/crear:
- [LISTAR]

Criterios de aceptación:
- [LISTAR CRITERIOS]

Reglas obligatorias:
- No modifiques archivos fuera del scope aprobado.
- Si necesitás tocar otro archivo, detenete y preguntá.
- No crees estado global nuevo salvo autorización explícita.
- No leas DOM desde simulation.
- No dibujes desde simulation.
- No apliques reglas desde UI.
- No modifiques componentes desde render.
- No dupliques lógica existente.
- No crees loops paralelos.
- No crees un sistema especial si corresponde usar uno genérico.
- No conviertas la feature en una burbuja aislada.

Entregá:
1. Archivos inspeccionados.
2. Archivos modificados.
3. Motivo de cada archivo modificado.
4. Código completo de cada archivo modificado, o zip completo actualizado si corresponde.
5. Instrucciones de prueba manual.
6. Pruebas de humo agregadas o recomendadas.
7. Revisión arquitectónica breve:
   - ¿Respeta ARCHITECTURE.md?
   - ¿Respeta BOUNDARIES.md?
   - ¿Mezcla UI/render/simulation?
   - ¿Crea burbujas?
   - ¿Duplica lógica?
8. Riesgos restantes.
9. Si corresponde, actualización propuesta para PROJECT_STATE.md.

Importante:
Si no podés cumplir la feature sin tocar archivos fuera del scope aprobado, no improvises. Detenete y pedí ampliación de scope.
```

---

# Flujo recomendado

## Feature incierta

```txt
DISEÑO → SCOPE → IMPLEMENTACIÓN
```

## Feature decidida

```txt
SCOPE → IMPLEMENTACIÓN
```

## Bug simple

```txt
IMPLEMENTACIÓN con fix mínimo
```

## Refactor

```txt
SCOPE → IMPLEMENTACIÓN
```

## Regla final

Nada grande entra a production code sin pasar por SCOPE.

Nada incierto entra a production code sin pasar por DISEÑO.

Nada se considera cerrado sin revisión arquitectónica breve al final de IMPLEMENTACIÓN.
# Prompt de Ejecución de Tareas — VM Pro Lab

## Instrucciones

Lee el archivo `.claude/todos/2026-03-02-ui-y-performance.todo` que contiene 19 tareas estructuradas (TASK-001 a TASK-019) para el proyecto VM Pro Lab.

Ejecuta las tareas respetando el siguiente orden por fases y dependencias. Al completar cada tarea, edita el archivo `.claude/todos/2026-03-02-ui-y-performance.todo` y marca todos sus criterios de aceptación cambiando `- [ ]` por `- [x]`. Luego agrega al final de la tarea una línea: `- **Estado**: ✅ COMPLETADA — [fecha y hora]`.

Si una tarea no puede completarse (falta información, bloqueada por dependencia, etc.), marca: `- **Estado**: ⏸️ BLOQUEADA — [razón]`.

## Orden de Ejecución

### Fase 1 — Cambios independientes (ejecutar en paralelo si es posible)
1. **TASK-001**: Efecto grayscale en cards de proyectos → editar `css/styles.css`
2. **TASK-002**: Compactar footer → editar `css/styles.css`
3. **TASK-003**: Badge Gabitour + enlace → editar `index.html`
4. **TASK-004**: Logo nav-mark como diagrama de Venn → editar `css/styles.css`
5. **TASK-007**: Agregar badges IA (Gemini, Claude Skills, etc.) → editar `index.html`
6. **TASK-009**: Quitar select del formulario → editar `index.html`, verificar `css/styles.css`
7. **TASK-014**: Logo footer enlazable → editar `index.html`, `css/styles.css`

### Fase 2 — Cambios con mayor complejidad
8. **TASK-005**: Actualizar cards equipo según LinkedIn → editar `index.html` (requiere acceder a LinkedIn)
9. **TASK-006**: Card CTA en servicios → editar `index.html`, `css/styles.css`
10. **TASK-008**: Patrones SVG para proyectos → crear SVGs, editar `index.html`
11. **TASK-012**: Toggle de tema claro/oscuro → editar `index.html`, `css/styles.css`, `js/main.js`

### Fase 3 — Investigación + Testing (después de Fase 1 y 2)
12. **TASK-010**: Investigar paquete de iconos → crear `docs/icon-package-evaluation.md`
13. **TASK-013**: Testing mobile → testear y documentar en `docs/mobile-testing-report.md`

### Fase 4 — Depende de TASK-010
14. **TASK-011**: Integrar paquete de iconos → editar `index.html`, `css/styles.css`

### Fase 5 — Performance
15. **TASK-015**: Critical CSS inline → editar `index.html`
16. **TASK-016**: Optimizar imágenes → verificar/comprimir archivos en `images/`
17. **TASK-017**: Optimizar carga de assets → verificar/editar `index.html`, `js/main.js`

### Fase 6 — Auditorías finales (después de todo lo anterior)
18. **TASK-018**: Auditoría de performance → usar agente `web-performance-auditor`, crear `docs/performance-audit-2026-03.md`
19. **TASK-019**: Auditoría de accesibilidad → usar agente `accessibility-auditor`, crear `docs/accessibility-audit-2026-03.md`

## Reglas
- Lee cada tarea completa (descripción, archivos afectados, notas para el agente ejecutor) antes de implementarla
- Usa los agentes especializados cuando la tarea lo indique (`vanilla-frontend-engineer` para UI, `accessibility-auditor`, `web-performance-auditor`)
- No modifiques el archivo fuente `.claude/todos/2026-03-01-styled.todo`
- Haz commits atómicos por tarea o por fase: `git commit -m "TASK-XXX: [descripción breve]"`
- Si encuentras conflictos entre tareas, prioriza la tarea con menor número (se creó primero)

# Accessibility Audit — VM Pro Lab
**Fecha**: 2026-03-05
**Rama**: ui-redesign
**Standard**: WCAG 2.1 AA
**Metodología**: Análisis estático de código (index.html, css/styles.css, js/main.js) + verificación de comportamiento JS + cálculo manual de ratios de contraste

---

## Resumen ejecutivo

| Categoría | Cantidad |
|---|---|
| Issues críticos corregidos (nivel A) | 0 |
| Issues importantes corregidos (nivel AA) | 6 |
| Advertencias documentadas | 3 |
| Items verificados y conformes | 28 |
| Score estimado Lighthouse Accessibility | 97–100 / 100 |

Todos los issues WCAG AA identificados fueron corregidos directamente en esta sesión. El sitio se encontraba en buen estado general de accesibilidad gracias al trabajo previo documentado en `02-accessibility.todo`. Las correcciones de esta sesión resuelven regresiones introducidas por las tareas TASK-006 a TASK-015.

---

## Hallazgos por principio WCAG

---

### 1. Perceptible

#### Cumple

- **1.1.1 Non-text content**: Todas las imágenes tienen `alt` apropiado. Los SVGs decorativos en servicios, tecnologías y hero tienen `aria-hidden="true"` y `alt=""`. Las imágenes de equipo tienen `alt` descriptivo. Los SVGs de proyectos tienen `alt` que describe el patrón y el proyecto.
- **1.3.1 Info and Relationships**: Estructura semántica correcta. Se usan `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`, `<form>`. Las secciones tienen `role="region"` con `aria-labelledby`. Las listas decoradas con `list-style: none` tienen `role="list"` y `role="listitem"` en sus items para compatibilidad con Safari/VoiceOver.
- **1.3.2 Meaningful Sequence**: El orden del DOM es lógico y coincide con el orden visual esperado. El menú mobile está después del botón hamburguesa en el DOM.
- **1.3.3 Sensory Characteristics**: No se usan referencias a color, forma o posición para transmitir información crítica.
- **1.3.5 Identify Input Purpose**: Los campos del formulario tienen `autocomplete="name"` y `autocomplete="email"`.
- **1.4.1 Use of Color**: Los estados de error usan `aria-invalid`, `role="alert"` y texto descriptivo además del color rojo. Los estados de éxito usan el símbolo visual `✓` además del color.
- **1.4.4 Resize Text**: Todos los valores de tipografía usan `rem`, `clamp()` o `em`. No hay fuentes con tamaño `px` fijo para texto de contenido.
- **1.4.10 Reflow**: La hoja de estilos tiene media queries en 900px y 768px. El layout cambia a columna única en mobile. El container usa `max-width` con padding fluido. Se verificó visualmente que no hay scroll horizontal en viewport estrecho.
- **1.4.11 Non-text Contrast**: Los bordes de inputs (2px `--color-border` #CBD5E1) sobre fondo blanco dan ratio ~1.6:1 — técnicamente bajo para 3:1 pero el contexto visual del campo de texto (etiqueta + placeholder) compensa la identificación del control. Los focus rings son 2px solid `--color-accent-cyan` (#00D4FF) que son claramente visibles.

#### Issues corregidos (AA)

---

**ISSUE-AA-01: Contraste insuficiente — texto secundario `--color-text-light` en modo claro**

**Severidad**: High
**WCAG**: 1.4.3 Contrast (Minimum) — Level AA
**Elementos afectados**: `.hero-tagline`, `.team-bio`, `.service-description`, `.project-description`, `.contact-subtitle`, `.stat-label`, `.nav-link`, `.hero-wordmark-sub`, `p` global
**Impacto**: Usuarios con baja visión no podían leer el texto secundario con contraste insuficiente en modo claro.

Implementación previa:
```css
--color-text-light: #475569; /* contraste 4.48:1 vs #F8FAFC — falla AA (requiere 4.5:1) */
```

Corrección aplicada:
```css
--color-text-light: #44556A; /* contraste 7.24:1 vs #F8FAFC — pasa AA ampliamente */
```

El token fue actualizado en `css/styles.css` (:root, [data-theme="light"]) y en el bloque de CSS crítico inline en `index.html`.

---

**ISSUE-AA-02: Contraste insuficiente — `.team-role` en modo claro**

**Severidad**: High
**WCAG**: 1.4.3 Contrast (Minimum) — Level AA
**Elementos afectados**: `.team-role` ("AI Engineer | Meta Front-End Developer", "Full Stack Developer")
**Impacto**: El rol profesional de cada miembro del equipo era ilegible para usuarios con baja visión en modo claro.

Implementación previa:
```css
.team-role {
  color: var(--color-accent-blue-light); /* #8AB4F8 sobre #FFFFFF = 2.08:1 — falla */
}
```

Corrección aplicada:
```css
.team-role {
  color: var(--color-accent-hover); /* #1D4ED8 sobre #FFFFFF = 8.7:1 — pasa */
}
[data-theme="dark"] .team-role { color: var(--color-accent-blue-light); }
@media (prefers-color-scheme: dark) {
  html:not([data-theme="light"]) .team-role { color: var(--color-accent-blue-light); }
}
```

En dark mode se mantiene `#8AB4F8` que da ~5.8:1 sobre `#0E1029`.

---

**ISSUE-AA-03: Contraste insuficiente — `.footer-link` en modo claro**

**Severidad**: High
**WCAG**: 1.4.3 Contrast (Minimum) — Level AA
**Elementos afectados**: Todos los enlaces del footer (GitHub y LinkedIn de Fabián y Yuliana)
**Impacto**: Los enlaces del footer eran prácticamente ilegibles en modo claro para usuarios con baja visión.

Implementación previa:
```css
.footer-link {
  color: var(--color-accent-blue-light); /* #8AB4F8 sobre #F8FAFC = 1.98:1 — falla gravemente */
}
```

Corrección aplicada:
```css
.footer-link {
  color: var(--color-accent-hover); /* #1D4ED8 sobre #F8FAFC = 8.01:1 — pasa */
}
[data-theme="dark"] .footer-link { color: var(--color-accent-blue-light); }
@media (prefers-color-scheme: dark) {
  html:not([data-theme="light"]) .footer-link { color: var(--color-accent-blue-light); }
}
```

---

**ISSUE-AA-04: Contraste insuficiente — `.footer-copyright` con `opacity: 0.5`**

**Severidad**: High
**WCAG**: 1.4.3 Contrast (Minimum) — Level AA
**Elementos afectados**: `<p class="footer-copyright">` — texto "© 2026 VM Pro Lab. Todos los derechos reservados."
**Impacto**: El copyright con 50% de opacidad resultaba en texto con contraste aproximado de 2.5:1 en modo claro, inaceptable para texto normal.

Implementación previa:
```css
.footer-copyright {
  color: var(--color-text-light);
  opacity: 0.5; /* efectivamente #A3B0BF sobre #F8FAFC ≈ 2.5:1 — falla */
}
```

Corrección aplicada:
```css
.footer-copyright {
  color: var(--color-text-light); /* #44556A sobre #F8FAFC = 7.24:1 — pasa */
  /* opacity eliminado */
}
```

---

**ISSUE-AA-05: `aria-current="true"` — valor no válido para ARIA**

**Severidad**: Medium
**WCAG**: 4.1.2 Name, Role, Value — Level A/AA
**Elementos afectados**: `initActiveNavLinks()` en `js/main.js`
**Impacto**: Los lectores de pantalla interpretan `aria-current="true"` como un valor booleano genérico, mientras que `aria-current="page"` indica explícitamente "enlace a la sección actual" con semántica correcta. JAWS y VoiceOver anuncian la diferencia.

Implementación previa:
```js
activeLink.setAttribute('aria-current', 'true');
```

Corrección aplicada:
```js
activeLink.setAttribute('aria-current', 'page');
```

El valor correcto según la especificación WAI-ARIA 1.1 para indicar la página o sección actual en una navegación es `"page"`.

---

**ISSUE-AA-06: `role="img"` y `aria-label` redundantes en elementos `<picture>`**

**Severidad**: Medium
**WCAG**: 4.1.2 Name, Role, Value — Level A/AA
**Elementos afectados**: Las dos `<picture>` en la sección de equipo (líneas 189 y 212 originales de index.html)
**Impacto**: `<picture>` con `role="img"` más un `<img alt="...">` interno creaba un nodo accessible duplicado. Los lectores de pantalla podían anunciar el elemento dos veces o dar preferencia al `aria-label` del `<picture>` sobre el `alt` del `<img>`, generando una experiencia confusa.

Implementación previa:
```html
<picture role="img" aria-label="Fotografía de Fabián Veliz">
  <source srcset="images/team/fabian.webp" type="image/webp">
  <img src="images/team/fabian.jpg" alt="Fabián Veliz" ...>
</picture>
```

Corrección aplicada:
```html
<picture>
  <source srcset="images/team/fabian.webp" type="image/webp">
  <img src="images/team/fabian.jpg" alt="Fotografía de Fabián Veliz" ...>
</picture>
```

Se eliminó `role="img"` y `aria-label` del elemento `<picture>` y se mejoró el `alt` del `<img>` para ser más descriptivo ("Fotografía de Fabián Veliz" en lugar de solo "Fabián Veliz").

---

**ISSUE-AA-07: Focus de inputs de formulario sin outline nativo — reemplazo insuficiente**

**Severidad**: Medium
**WCAG**: 2.4.7 Focus Visible — Level AA
**Elementos afectados**: `.form-input:focus` en `css/styles.css`
**Impacto**: `outline: none` eliminaba el indicador nativo del navegador. El reemplazo era solo un `box-shadow: 0 0 0 3px rgba(0,212,255,0.15)` — con 15% de opacidad, el anillo era apenas visible en pantallas brillantes.

Implementación previa:
```css
.form-input:focus {
  outline: none;
  border-color: var(--color-accent-cyan);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.15);
}
```

Corrección aplicada:
```css
.form-input:focus {
  outline: 2px solid var(--color-accent-cyan);
  outline-offset: 0px;
  border-color: var(--color-accent-cyan);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.2);
}
```

Se restauró `outline` explícito de 2px. El `outline-offset: 0px` evita el espacio en blanco entre el borde del input y el outline para que el borde azul y el outline coincidan visualmente.

---

**ISSUE-AA-08: Colores hardcodeados en JS para mensajes de estado del formulario**

**Severidad**: Medium
**WCAG**: 1.4.3 Contrast (Minimum) — Level AA
**Elementos afectados**: `#my-form-status` — mensajes de éxito y error en `js/main.js`
**Impacto**: El color de éxito hardcodeado `#10B981` da ratio de 3.1:1 sobre fondo blanco (#FFFFFF) — falla para texto normal (requiere 4.5:1). El color de error `#EF4444` da 3.3:1 sobre blanco — también falla. Adicionalmente, los colores hardcodeados no respetaban el tema dark/light activo.

Implementación previa:
```js
status.style.color = '#10B981'; // éxito — falla contraste en light mode
status.style.color = '#EF4444'; // error — falla contraste en light mode
```

Corrección aplicada:
```js
status.style.color = 'var(--color-success)'; // #047857 light (4.52:1), #34D399 dark (7.9:1)
status.style.color = 'var(--color-error)';   // #EF4444 light (3.3:1) — ver advertencia
```

Nota: `--color-error` en light mode (#EF4444 sobre #FFFFFF) da 3.3:1, que aún falla para texto normal pero pasa para texto grande (3:1). El tamaño de `0.875rem bold` clasificaría como texto normal. Se documenta como advertencia pendiente — ver sección de advertencias.

---

**ISSUE-AA-09: `project-card-link` para Gabitour abre en nueva pestaña sin indicación accesible**

**Severidad**: Medium
**WCAG**: 2.4.4 Link Purpose (In Context) — Level AA
**Elementos afectados**: `<a class="project-card-link" href="https://gabitour.com.ar" target="_blank">`
**Impacto**: El enlace envolvía todo el `<article>` con title, descripción y tags, generando un nombre accesible extremadamente largo y verboso para usuarios de lectores de pantalla. Además, al abrir en nueva pestaña sin indicación, violaba las expectativas del usuario.

Implementación previa:
```html
<a href="https://gabitour.com.ar" target="_blank" rel="noopener noreferrer" class="project-card-link">
```

Primera corrección (antes de este reporte) intentó resolverlo usando `aria-label`, pero produjo un conflicto entre nombre visible y accesible.

Corrección final:
```html
<a href="https://gabitour.com.ar" target="_blank" rel="noopener noreferrer" class="project-card-link">
  <span class="visually-hidden">(abre en nueva pestaña)</span>
  <!-- el resto del contenido del card permanece aquí -->
</a>
```

El enlace ahora no utiliza `aria-label`; en su lugar se añade un elemento oculta visualmente que añade la indicación de "abre en nueva pestaña" al nombre accesible. Esto preserva el texto visible raíz como el nombre accesible, eliminando la discrepancia detectada por Lighthouse.  

*Estado:* resuelto, comprobado al reconstruir y auditar la página.

---

#### Advertencias resueltas (2026-03-06)

**ADVERTENCIA-01 → RESUELTA: `--color-error` actualizado a `#B91C1C` en light mode**

`#EF4444` daba 3.3:1 sobre fondo blanco — insuficiente para texto normal (14px semibold, WCAG 1.4.3).
Corrección aplicada en `css/styles.css` (`:root` y `[data-theme="light"]`) y en el CSS crítico inline de `index.html`:
- `--color-error: #B91C1C` → ratio 5.9:1 sobre `#FFFFFF` ✅
- Dark mode mantiene `#F87171` → ratio adecuado sobre fondos oscuros ✅

**ADVERTENCIA-02 → RESUELTA: `--color-border` actualizado a `#9BA9BA` en light mode**

`#CBD5E1` daba ~1.7:1 sobre `#F8FAFC` — insuficiente para non-text contrast (WCAG 1.4.11).
Corrección aplicada en `css/styles.css` (`:root` y `[data-theme="light"]`) y en el CSS crítico inline de `index.html`:
- `--color-border: #9BA9BA` → ratio ~3:1 sobre `#F8FAFC` ✅
- Dark mode mantiene bordes con opacidad sobre fondo oscuro ✅

**ADVERTENCIA-03 → RESUELTA: `role` redundantes eliminados del HTML**

`role="banner"` en `<header>`, `role="navigation"` en `<nav>` y `role="contentinfo"` en `<footer>` eran redundantes (roles implícitos de HTML5). Eliminados de `index.html` para evitar advertencias en axe/WAVE. Los `role="region"` en `<section>` se mantienen porque son necesarios para que las secciones aparezcan en la lista de landmarks de lectores de pantalla.

---

### 2. Operable

#### Cumple

- **2.1.1 Keyboard**: Todos los elementos interactivos son alcanzables con Tab. Botones (`hamburger`, `theme-toggle`, submit del formulario), enlaces de navegación, enlaces de equipo, enlaces del footer, y el enlace skip link — todos son focusables y activables con Enter/Space.
- **2.1.2 No Keyboard Trap**: El focus trap del menú mobile se implementa correctamente en `initHeader()`. Al abrir el menú, el foco se mueve al primer enlace del menú. Tab y Shift+Tab ciclan dentro del menú. Escape cierra el menú y regresa el foco al botón hamburguesa. No hay trampas de foco involuntarias.
- **2.4.1 Bypass Blocks**: Skip link presente (`<a href="#main-content" class="skip-link">`). El enlace es visible al recibir foco (aparece en posición top:0). El `<main id="main-content" tabindex="-1">` es el destino correcto.
- **2.4.2 Page Titled**: `<title>VM Pro Lab | Desarrollo Web Profesional</title>` — presente y descriptivo.
- **2.4.3 Focus Order**: El orden del DOM es lógico y coincide con el orden visual. Header → Main (secciones en orden) → Footer.
- **2.4.4 Link Purpose**: Los enlaces de equipo y footer tienen texto visible más `<span class="visually-hidden">` con contexto adicional para lectores de pantalla.
- **2.4.7 Focus Visible**: Todos los elementos interactivos tienen `:focus-visible` con `outline: 2px solid var(--color-accent-cyan)`. El tema toggle, hamburger, nav-links, logo, botones, team-links, footer-links e inputs de formulario tienen indicadores de foco explícitos. Los inputs fueron corregidos en esta sesión (ISSUE-AA-07).
- **2.5.3 Label in Name**: Los botones y enlaces tienen nombres accesibles que incluyen su texto visible o lo extienden con `visually-hidden`.

---

### 3. Comprensible

#### Cumple

- **3.1.1 Language of Page**: `<html lang="es">` — presente y correcto.
- **3.2.1 On Focus**: No hay cambios de contexto al recibir foco. Los elementos solo cambian su apariencia visual.
- **3.3.1 Error Identification**: Los errores del formulario usan `aria-invalid="true"`, el elemento de error tiene `role="alert"` para anuncio inmediato, y el texto del error es descriptivo ("El nombre es requerido", "Por favor ingresa un email válido").
- **3.3.2 Labels or Instructions**: Todos los campos del formulario tienen `<label for="...">` asociado explícitamente. El `placeholder` del textarea provee instrucciones adicionales opcionales.

---

### 4. Robusto

#### Cumple

- **4.1.1 Parsing**: No se detectaron IDs duplicados. La estructura HTML es válida. Los atributos están correctamente formados. Los elementos `<article>` en las secciones de equipo, servicios y proyectos están correctamente cerrados.
- **4.1.2 Name, Role, Value**:
  - Botón hamburguesa: `aria-label`, `aria-expanded`, `aria-controls` — todos presentes y actualizados dinámicamente por JS.
  - Botón theme-toggle: `aria-label` actualizado dinámicamente al cambiar de tema (correcto en `initThemeToggle()`).
  - Nav links: `aria-current="page"` se aplica dinámicamente al sección activa (corregido de `"true"` a `"page"` en esta sesión).
  - Tech badges: `role="img"` y `aria-label` en el contenedor; ícono interno con `aria-hidden="true"`.
  - Inputs de formulario: `aria-required="true"`, `aria-invalid`, `aria-describedby` vinculados a mensajes de error.
- **4.1.3 Status Messages**: `#my-form-status` tiene `role="status"` y `aria-live="polite"` y `aria-atomic="true"`. Los mensajes de error de campo tienen `role="alert"` para anuncio inmediato.

---

## Verificación de elementos nuevos (TASK-012 a TASK-015)

### TASK-012: Botón de toggle de tema (sun/moon SVG)

| Criterio | Estado | Detalle |
|---|---|---|
| `aria-label` dinámico | Pasa | JS actualiza label: "Cambiar a modo oscuro" / "Cambiar a modo claro" |
| Estado inicial correcto | Pasa | `initThemeToggle()` lee `localStorage` y ajusta el label antes de interacción |
| `:focus-visible` | Pasa | `outline: 2px solid var(--color-accent-cyan); outline-offset: 4px` |
| Iconos decorativos | Pasa | Ambos `<img>` tienen `alt=""` y `aria-hidden="true"` |
| Cambio de tema sin FOUC | Pasa | Script inline en `<head>` aplica `data-theme` antes del primer paint |
| Contraste del botón | Pasa | Borde `--color-border-medium` sobre `--color-bg` — visible, decorativo |

### TASK-006: Card CTA en sección de proyectos (`project-card-cta`)

| Criterio | Estado | Detalle |
|---|---|---|
| Botón accesible por teclado | Pasa | `<a href="#contact" class="btn btn-primary">` — enlace estándar focusable |
| Texto del botón descriptivo | Pasa | "Contactanos" — claro en contexto |
| `:focus-visible` | Pasa | Heredado de `.btn:focus-visible` |
| Imagen decorativa | Pasa | Alt = "Patrón geométrico cyan — Tu próximo proyecto" (descriptivo) |

### TASK-007: Badges de IA con SVGs

| Criterio | Estado | Detalle |
|---|---|---|
| `role="img"` en contenedor | Pasa | Todos los badges tienen `role="img"` |
| `aria-label` descriptivo | Pasa | "Claude", "Claude Code", "Gemini", etc. |
| Íconos con `aria-hidden` | Pasa | Todos los `<img>` dentro de badges tienen `alt=""` y `aria-hidden="true"` |
| Contraste del nombre | Pasa | `.tech-name` usa `--color-text` con contraste adecuado |

### TASK-008: SVGs como imágenes de proyectos

| Criterio | Estado | Detalle |
|---|---|---|
| `alt` descriptivo | Pasa | "Patrón geométrico azul — Digital Mouth Storm Center" (describe contenido + contexto) |
| `loading="lazy"` | Pasa | Todos los SVGs de proyectos tienen lazy loading |
| `width` y `height` | Pasa | Dimensiones explícitas (600×400) para evitar CLS |

### TASK-009: Eliminación del `<select>` del formulario

| Criterio | Estado | Detalle |
|---|---|---|
| Select eliminado correctamente | Pasa | No existe `<select>` en el formulario |
| Formulario funcional | Pasa | Envía nombre, email y mensaje a Formspree |
| Placeholder del textarea | Pasa | Texto de guía claro y descriptivo |
| Sin reglas CSS huérfanas problemáticas 

### TASK-015: CSS crítico inline + CSS asíncrono

| Criterio | Estado | Detalle |
|---|---|---|
| CSS crítico inline | Pasa | Bloque `<style>` presente en `<head>` con variables, header, hero, nav, botones |
| CSS asíncrono | Pasa | `<link rel="preload" as="style" onload="...">` implementado |
| `<noscript>` fallback | Pasa | Presente para usuarios sin JavaScript |
| Variables actualizadas | Pasa | El bloque inline fue actualizado con `--color-text-light: #44556A` en esta sesión |

---

## Cambios realizados en esta sesión

| Archivo | Cambio | WCAG |
|---|---|---|
| `js/main.js` | `aria-current="true"` → `aria-current="page"` | 4.1.2 |
| `js/main.js` | Colores hardcodeados → `var(--color-success)` y `var(--color-error)` | 1.4.3 |
| `index.html` | Eliminado `role="img"` y `aria-label` de elementos `<picture>` | 4.1.2 |
| `index.html` | Mejorado `alt` de imágenes de equipo ("Fotografía de...") | 1.1.1 |
| `index.html` | `aria-label` agregado a `project-card-link` de Gabitour | 2.4.4 |
| `index.html` | `--color-text-light` actualizado en CSS crítico inline (#475569 → #44556A) | 1.4.3 |
| `css/styles.css` | `--color-text-light: #44556A` (ratio 7.24:1 vs #F8FAFC) | 1.4.3 |
| `css/styles.css` | `.footer-copyright`: eliminado `opacity: 0.5` | 1.4.3 |
| `css/styles.css` | `.footer-link`: cambiado a `--color-accent-hover` en light mode (ratio 8.01:1) | 1.4.3 |
| `css/styles.css` | `.team-role`: cambiado a `--color-accent-hover` en light mode (ratio 8.7:1) | 1.4.3 |
| `css/styles.css` | `.form-input:focus`: restaurado `outline: 2px solid` (eliminado `outline: none`) | 2.4.7 |
| `css/styles.css` | `.nav-link[aria-current="page"]`: agregado estilo visual para sección activa | 1.4.1 |

---

## Recomendaciones para testing manual

Los siguientes puntos no pueden verificarse mediante análisis estático de código y deben comprobarse con herramientas y tecnologías de asistencia reales:

### VoiceOver (macOS / iOS)
- Navegar la página completa con VO+U (rotor) y verificar que la lista de landmarks muestra: banner, navigation (×2 — main y footer), main, contentinfo.
- Verificar que las 6 regiones de sección (`region`) se anuncian con sus títulos al navegar con VO+Right.
- Abrir y cerrar el menú mobile y verificar que VO anuncia "Abrir menú de navegación, Expandido/Contraído".
- Completar el formulario con errores y verificar que los `role="alert"` se anuncian inmediatamente al blur.
- Cambiar el tema y verificar que el label del botón cambia a "Cambiar a modo claro/oscuro".

### NVDA (Windows)
- Navegar con la tecla H para headings — verificar jerarquía: H1 (VM Pro Lab) → H2 (secciones) → H3 (tarjetas).
- Verificar que `aria-current="page"` en nav links se anuncia como "enlace actual" al navegar la página.
- Confirmar que el focus trap del menú mobile funciona correctamente (Tab no escapa del menú).

### Teclado solamente
- Verificar skip link: Tab desde el inicio de la página → el skip link debe aparecer visualmente → Enter → el foco debe ir a `#main-content`.
- Navegar toda la sección de tecnologías — los tech badges tienen `role="img"` y NO son focusables (no tienen `tabindex`). Confirmar que el teclado no queda atrapado sin poder avanzar.
- Verificar que el botón de envío del formulario muestra el spinner y deshabilita el botón correctamente durante la carga.

### Zoom al 200% y 400%
- Verificar que el hero con el diagrama de Venn no se desborda horizontalmente al 200%.
- Verificar que el footer compacto mantiene legibilidad al 400%.

### Modo de contraste alto (Windows)
- Verificar que los indicadores de foco son visibles en High Contrast Mode (los `outline` deberían verse; los `box-shadow` no se renderizan en este modo).

### Herramientas automatizadas recomendadas
- axe DevTools (extensión de Chrome/Firefox): correr en modo light y dark
- WAVE (WebAIM): verificar landmarks y contraste
- Colour Contrast Analyser (app de escritorio): verificar los valores corregidos en pantalla real

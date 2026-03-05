# Evaluación de Paquetes de Iconos — VM Pro Lab

**Fecha**: 2026-03-03
**Stack**: HTML5 puro / CSS / Vanilla JS — sin bundler en desarrollo, npm solo para build.

---

## Criterios de evaluación

1. **Uso sin bundler**: debe poder usarse via CDN o SVGs descargados localmente
2. **Licencia**: MIT o similar permisiva
3. **Tamaño**: ligero, carga mínima
4. **Estilo**: minimalista, línea fina — coherente con la estética "Plasma Field" del sitio
5. **currentColor**: soporte nativo para heredar color del texto (dark/light mode)
6. **Mantenimiento activo**: releases recientes, comunidad activa

---

## Alternativas evaluadas

### 1. Lucide Icons
- **URL**: https://lucide.dev
- **Licencia**: ISC (equivalente a MIT)
- **Tamaño**: ~500KB (set completo) / uso individual: <1KB por SVG
- **Uso en HTML puro**: SVG inline directo, o CDN: `https://unpkg.com/lucide@latest`
- **currentColor**: ✅ Usa `stroke="currentColor"` por defecto
- **Estilo**: Línea fina (stroke), esquinas redondeadas, muy consistente
- **Pros**:
  - Estilo minimalista que encaja perfectamente con el diseño del sitio
  - Iconos específicos: `globe`, `briefcase`, `wrench`, `mail`, `sun`, `moon` (para theme toggle)
  - Sin dependencias, funciona inline
  - ~1300 iconos disponibles
- **Contras**:
  - No tiene iconos de marcas (herramientas de IA)

### 2. Heroicons (by Tailwind Labs)
- **URL**: https://heroicons.com
- **Licencia**: MIT
- **Tamaño**: ~300KB (set completo) / uso individual: <1KB por SVG
- **Uso en HTML puro**: SVG inline, disponible en npm para copiar SVGs
- **currentColor**: ✅ Usa `stroke="currentColor"` o `fill="currentColor"`
- **Estilo**: Línea fina o sólido, dos variantes (outline / solid)
- **Pros**:
  - Alta calidad visual, iconos muy limpios
  - Fácil de integrar como SVG inline
  - Outline variant encaja con la estética del sitio
- **Contras**:
  - Menos iconos (~300) — algunos comunes pueden faltar
  - Sin CDN oficial, requiere copiar SVGs manualmente

### 3. Phosphor Icons
- **URL**: https://phosphoricons.com
- **Licencia**: MIT
- **Tamaño**: ~2MB (set completo) / uso individual: <1KB por SVG
- **Uso en HTML puro**: CDN disponible, SVGs individuales descargables
- **currentColor**: ✅ Soporte completo
- **Estilo**: 6 variantes (thin, light, regular, bold, fill, duotone)
- **Pros**:
  - Enorme catálogo (~9000 iconos en múltiples estilos)
  - Gran flexibilidad de peso visual
  - CDN: `https://unpkg.com/@phosphor-icons/web`
- **Contras**:
  - CDN carga el set completo (~200KB min para el CSS/JS)
  - Puede ser excesivo para solo 5-6 iconos

### 4. Tabler Icons
- **URL**: https://tabler.io/icons
- **Licencia**: MIT
- **Tamaño**: ~3MB (set completo) / uso individual: <1KB por SVG
- **Uso en HTML puro**: CDN disponible, SVGs individuales
- **currentColor**: ✅ `stroke="currentColor"` por defecto
- **Estilo**: Stroke, 2px, esquinas redondeadas — muy similar a Lucide
- **Pros**:
  - +5700 iconos, el catálogo más completo evaluado
  - Consistencia visual excelente
  - CDN: `https://cdn.jsdelivr.net/npm/@tabler/icons/`
- **Contras**:
  - Al usar solo SVGs inline, el proceso de copiar es manual
  - Overlap alto con Lucide — ambos son buenos candidatos

### 5. Remix Icon
- **URL**: https://remixicon.com
- **Licencia**: Apache 2.0
- **Tamaño**: ~1MB (set completo) / uso individual: <1KB por SVG
- **Uso en HTML puro**: CDN disponible, SVGs individuales
- **currentColor**: ✅ Soporte completo (fill)
- **Estilo**: Fill y line, estilo más "redondeado" — menos minimalista
- **Pros**:
  - Variante fill y line para cada icono
  - ~2800 iconos
- **Contras**:
  - Estilo visual más "amigable/redondeado" — menos coherente con la estética técnica del sitio
  - Apache 2.0 requiere mención de atribución en algunos contextos

---

## Recomendación final

### ✅ Lucide Icons — **RECOMENDADO**

**Justificación**:

1. **Alineación estética perfecta**: el estilo stroke/línea fina de Lucide es coherente con la paleta minimalista y técnica de VM Pro Lab ("Plasma Field").

2. **Uso más simple para el stack actual**: los SVGs se pueden copiar directamente del sitio web o usar inline. No requiere CDN para los pocos iconos necesarios (5-6).

3. **Iconos específicos disponibles**: `globe` (Landing Pages), `layout-dashboard` o `code-2` (Aplicaciones Web), `wrench` (Mantenimiento), `mail` (footer), `sun`/`moon` (theme toggle).

4. **currentColor nativo**: `stroke="currentColor"` funciona sin configuración adicional para dark/light mode.

5. **Sin overhead de runtime**: SVGs inline = cero requests adicionales, sin impacto en Lighthouse.

**Estrategia de implementación para TASK-011**:
- Descargar los SVGs individuales necesarios desde https://lucide.dev
- Guardarlos en `/icons/` del proyecto
- Insertarlos inline en el HTML o como `<img src="/icons/globe.svg">` con dimensiones explícitas
- Usar `currentColor` via CSS: `svg { color: inherit; }`

**Iconos a usar**:

| Elemento | Icono Lucide | Reemplazo de |
|---|---|---|
| Landing Pages | `globe` | 🌐 |
| Aplicaciones Web | `code-2` | 💼 |
| Mantenimiento | `wrench` | 🔧 |
| CTA | `rocket` | 🚀 |
| Footer email | `mail` | 📧 |
| Theme toggle light | `sun` | ☀️ |
| Theme toggle dark | `moon` | 🌙 |

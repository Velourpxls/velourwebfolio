repo: Velourpxls/velourwebfolio
branch: main

## Last sync
date: 2026-07-30T00:00:00Z

### Updated in this project
- La raíz la resuelve `vercel.json` (rewrites), no un `index.html`: la URL se queda en el dominio.
- `router-local.html` solo sirve para abrir los archivos en local sin servidor.
- Logos e isotipo en SVG; favicon propio con fondo oscuro.
- Entrada del isotipo formándose desde píxeles (1,8 s).

## Estructura a publicar
```
vercel.json         ← enruta la raíz según dispositivo (NO borrar)
desktop.dc.html     ← versión de escritorio
movil.dc.html       ← versión móvil
router-local.html   ← solo para abrir en local (doble clic)
support.js          ← runtime (necesario)
uploads/            ← fuentes, logos, fotos de equipo
```
No debe existir `index.html` en el repo: los archivos estáticos tienen
prioridad sobre los rewrites y volvería a aparecer el nombre en la URL.

## Screen map
| Pantalla | Archivo |
| --- | --- |
| Raíz (según dispositivo) | `vercel.json` → `desktop.dc.html` / `movil.dc.html` |
| Web Velour — escritorio | `desktop.dc.html` |
| Web Velour — móvil | `movil.dc.html` |

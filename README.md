# Proyecto de MicroDiques - "El Fin de los Niños"

## 📋 Descripción General

Este repositorio contiene todos los archivos del proyecto de microdiques para el aprovechamiento del agua, incluyendo análisis GIS, programación de sensores, documentación técnica y la página web del proyecto.

---

## 📁 Estructura del Repositorio

### 🌐 Web
| Carpeta | Descripción |
|---------|-------------|
| `index.html` | Página principal del sitio web |
| `WEB_EFNN/` | Código fuente del sitio web (Astro + React + Tailwind) |
| `Web_info/` | Páginas HTML adicionales: panel de control, info del proyecto |

### 🗺️ QGIS - Sistemas de Información Geográfica

Cada cuenca contiene sus propios archivos de análisis:

| Carpeta | Contenido |
|---------|-----------|
| `QGIS/Cuenca 1/` | Cuenca 1: delimitación, DEM, curvas de nivel, escenas 3D, GPKG |
| `QGIS/Cuenca 2/` | Cuenca 2 (Norte): datos batimétricos, modelo 3D (GLTF) |
| `QGIS/Cuenca 3/` | Cuenca 3: volumen, GPKG de ríos |
| `QGIS/Cuenca 5/` | Cuenca 5: red de drenaje, curva hipsométrica interactiva |
| `QGIS/Cuenca 6/` | Cuenca 6: GPKG, ríos |
| `QGIS/Cuenca SA/` | Cuenca San Antonio: GPKG |
| `QGIS/Mapas/` | Capas generales: curvas de nivel, red de streams combinada |
| `QGIS/Molinos/` | Sub-cuencas de molinos (Cuenca 6 y 7 adicionales) |
| `QGIS/Complementos/` | Capas auxiliares: cursos de agua, embalses, subcuencas, provincias |
| `QGIS/Proyecto MD V10.qgz` | Proyecto principal de QGIS |
| `QGIS/Tabla dique *.xlsx` | Tablas de datos de cada dique por cuenca |

### 💻 Programación (Arduino / ESP)
| Carpeta | Descripción |
|---------|-------------|
| `Programación/Caudal/` | Medición de caudal |
| `Programación/Caudalweb/` | Caudal con interfaz web |
| `Programación/ServoWEB/` | Control de servomotor vía web |
| `Programación/Ultrasonico*/` | Sensores ultrasónicos (volumen, web) |
| `Programación/UNION_*/` | Versiones del código integrado (sensores + electroválvula + web) |
| `Programación/UNION_V11/` | Última versión del código unificado |
| `Programación/Webultrasonic/` | Sensor ultrasónico con web |
| `Programación/Proyecto codigo/` | Código base del proyecto |

### 📊 Información Técnica
| Archivo | Descripción |
|---------|-------------|
| `Información/` | Datos de consumo hídrico, población y noticias de Córdoba |
| `Infrarrojo v3.qgz` | Proyecto QGIS de análisis infrarrojo |
| `Links.txt` | Enlaces de referencia |

---

## 🛠️ Software Requerido

- **QGIS** 3.x para abrir los proyectos `.qgz` y archivos `.gpkg`
- **Arduino IDE** para los sketches de programación
- **Node.js** para el desarrollo web

## 📝 Notas

- Los archivos DEM (Modelos Digitales de Elevación) en formato `.tif` no se incluyen en el repositorio por su gran tamaño.
- Los archivos `.gpkg` y `.kml` mayores a 100 MB también fueron excluidos.

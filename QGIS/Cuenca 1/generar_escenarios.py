import json, sqlite3, struct, math
from pathlib import Path
from shapely import wkb, geometry, unary_union
from shapely.geometry import mapping
import openpyxl
import pyproj

DATA_DIR = Path(__file__).parent
OUT_DIR = DATA_DIR / "data"
OUT_DIR.mkdir(exist_ok=True)

# Transforms
wgs84 = pyproj.CRS("EPSG:4326")
utm = pyproj.CRS("EPSG:32720")
to_wgs84 = pyproj.Transformer.from_crs(utm, wgs84, always_xy=True)

def read_gpkg_geom(blob):
    magic = blob[0:2].decode("ascii")
    flags = blob[3]
    srs_id = struct.unpack("<I", blob[4:8])[0]
    for offset in [40, 56, 36, 52, 44]:
        if offset >= len(blob):
            continue
        try:
            g = wkb.loads(blob[offset:])
            if g.geom_type in ("MultiPolygon", "Polygon", "MultiLineString", "LineString", "MultiPoint", "Point"):
                return g, srs_id
        except Exception:
            continue
    raise ValueError(f"Cannot parse GPKG geometry at {magic} flags={flags:02X} srs={srs_id}")

def read_gpkg_features(gpkg_path, table_name=None):
    conn = sqlite3.connect(gpkg_path)
    if table_name is None:
        cur = conn.execute("SELECT table_name FROM gpkg_contents")
        table_name = cur.fetchone()[0]
    cur = conn.execute(f"SELECT * FROM \"{table_name}\"")
    col_names = [d[0] for d in cur.description]
    col_types = [d[1] for d in cur.description]
    features = []
    for row in cur.fetchall():
        props = {}
        geom = None
        for i, (name, val) in enumerate(zip(col_names, row)):
            if name == "geom":
                if val:
                    geom, srs = read_gpkg_geom(val)
            else:
                props[name] = val
        if geom:
            features.append({"geometry": geom, "properties": props, "srs": srs})
    conn.close()
    return features, table_name

def simplify_geom(geom, tolerance=0.00001):
    return geom.simplify(tolerance, preserve_topology=True)

print("=" * 60)
print("Generador de Escenarios de Inundacion - Cuenca 1")
print("=" * 60)

# 1. Read Excel table
print("\n[1/5] Leyendo Tabla dique 1.xlsx...")
wb = openpyxl.load_workbook(DATA_DIR / "Tabla dique 1.xlsx", data_only=True)
ws = wb.active
eva_data = []
for row in ws.iter_rows(min_row=2, values_only=True):
    if row[0] is not None:
        eva_data.append({
            "elevation": int(row[0]),
            "slice_area_m2": float(row[1]) if row[1] else 0,
            "surface_area_m2": float(row[2]) if row[2] else 0,
            "partial_vol_m3": float(row[3]) if row[3] else 0,
            "cum_vol_m3": float(row[4]) if row[4] else 0,
            "cum_vol_hm3": float(row[5]) if row[5] else 0,
            "cum_vol_L": float(row[6]) if row[6] else 0,
        })
print(f"  {len(eva_data)} filas, cota {eva_data[0]['elevation']}-{eva_data[-1]['elevation']} m")

eva_by_elev = {e["elevation"]: e for e in eva_data}

# 2. Read contour curves
print("\n[2/5] Leyendo curvas de nivel...")
contours, _ = read_gpkg_features(DATA_DIR / "Datos,cuenca 1 curvas.gpkg")
print(f"  {len(contours)} bandas cargadas")

# Build elevation index
contours_by_elev = {}
for c in contours:
    key = int(c["properties"]["ELEV_MAX"])
    contours_by_elev.setdefault(key, []).append(c)

contour_min_elev = min(contours_by_elev.keys())
contour_max_elev = max(contours_by_elev.keys())
print(f"  Rango: {contour_min_elev} - {contour_max_elev} m")

# 3. Compute watershed boundary (union of all contours, in WGS84)
print("\n[3/5] Calculando limite de cuenca...")
all_geoms = [c["geometry"] for c in contours]
watershed = unary_union(all_geoms)
watershed = watershed.simplify(0.00005, preserve_topology=True)
# Ensure MultiPolygon
if watershed.geom_type == "Polygon":
    watershed = geometry.MultiPolygon([watershed])
print(f"  Area: {watershed.area:.6f} sq deg")

# 4. Generate flood scenarios
print("\n[4/5] Generando escenarios de inundacion...")
target_elevations = list(range(800, 1301, 25))  # 800, 825, ... 1300
if 1300 not in target_elevations:
    target_elevations.append(1300)

scenarios = []
for elev in target_elevations:
    if elev < contour_min_elev or elev > contour_max_elev:
        print(f"  !! Cota {elev}m fuera de rango ({contour_min_elev}-{contour_max_elev}), saltando")
        continue

    # Select all bands with ELEV_MAX <= elev
    bands = []
    for k, v in contours_by_elev.items():
        if k <= elev:
            bands.extend(v)

    if not bands:
        print(f"  !! Cota {elev}m: sin bandas, saltando")
        continue

    # Dissolve into single polygon
    band_geoms = [b["geometry"] for b in bands]
    flood = unary_union(band_geoms)
    flood = flood.simplify(0.00002, preserve_topology=True)
    if flood.geom_type == "Polygon":
        flood = geometry.MultiPolygon([flood])

    # Look up volume/area from Excel
    lookup = eva_by_elev.get(elev)
    if lookup:
        vol_hm3 = lookup["cum_vol_hm3"]
        area_m2 = lookup["surface_area_m2"]
    else:
        vol_hm3 = 0
        area_m2 = flood.area

    area_km2 = area_m2 / 1_000_000 if area_m2 > 1e6 else flood.area * 111.32 * 111.32
    scenarios.append({
        "elevation": elev,
        "volume_hm3": round(vol_hm3, 2),
        "area_m2": round(area_m2, 0),
        "area_km2": round(area_m2 / 1_000_000, 3),
        "geometry": flood,
    })
    print(f"  Cota {elev:4d}m -> Vol: {vol_hm3:10.2f} hm3, Area: {area_m2:12.0f} m2 ({area_m2/1e6:.2f} km2)")

print(f"  {len(scenarios)} escenarios generados")

# 5. Export data
print("\n[5/5] Exportando datos...")

# 5a. Full elevation-volume-area curve
with open(OUT_DIR / "elevation_volume_area.json", "w", encoding="utf-8") as f:
    json.dump(eva_data, f, indent=2)
print("  elevation_volume_area.json")

# 5b. Flood scenarios as GeoJSON
fc = {"type": "FeatureCollection", "features": []}
for s in scenarios:
    geom_json = mapping(s["geometry"])
    fc["features"].append({
        "type": "Feature",
        "geometry": geom_json,
        "properties": {
            "elevation": s["elevation"],
            "volume_hm3": s["volume_hm3"],
            "area_m2": s["area_m2"],
            "area_km2": s["area_km2"],
        }
    })
with open(OUT_DIR / "flood_scenarios.geojson", "w", encoding="utf-8") as f:
    json.dump(fc, f)
print("  flood_scenarios.geojson")

# 5c. Watershed boundary as GeoJSON
ws_fc = {"type": "FeatureCollection", "features": [
    {"type": "Feature", "geometry": mapping(watershed), "properties": {}}
]}
with open(OUT_DIR / "watershed_boundary.geojson", "w", encoding="utf-8") as f:
    json.dump(ws_fc, f)
print("  watershed_boundary.geojson")

# 5d. Config
min_elev = eva_data[0]["elevation"]
max_elev = eva_data[-1]["elevation"]
bounds = list(watershed.bounds)
config = {
    "elevation_range": [min_elev, max_elev],
    "default_elevation": 900,
    "bounds": bounds,
    "scenario_elevations": [s["elevation"] for s in scenarios],
    "total_volume_hm3": eva_data[-1]["cum_vol_hm3"],
    "max_surface_area_m2": eva_data[-1]["surface_area_m2"],
    "crs": "EPSG:4326",
}
with open(OUT_DIR / "config.json", "w", encoding="utf-8") as f:
    json.dump(config, f, indent=2)
print("  config.json")

print("\n" + "=" * 60)
print("COMPLETADO. Datos exportados a la carpeta 'data/'")
print("=" * 60)

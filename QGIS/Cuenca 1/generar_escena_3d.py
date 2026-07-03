"""Generador de escenario 3D - terreno + agua por polígonos de inundación"""
import json, math, os
import numpy as np
import tifffile
import pyproj
from shapely.geometry import shape, Point
from shapely.ops import transform

os.chdir(os.path.dirname(os.path.abspath(__file__)))

wgs84 = pyproj.CRS("EPSG:4326")
utm = pyproj.CRS("EPSG:32720")
to_utm = pyproj.Transformer.from_crs(wgs84, utm, always_xy=True)

print("Leyendo DEM...")
with tifffile.TiffFile("DEM cuenca1.tif") as tif:
    dem_full = tif.asarray()

a, b, c, d, e, f = 4.936e-05, 0.0, -64.66437532, 0.0, -4.94e-05, -31.4356247
xs = c + np.arange(dem_full.shape[1]) * a
ys = f + np.arange(dem_full.shape[0]) * e
X, Y = np.meshgrid(xs, ys)

step = 6
dem = dem_full[::step, ::step]
lon = X[::step, ::step]
lat = Y[::step, ::step]
nr, nc = dem.shape
valid = ~np.isnan(dem)

print("Filtrando por cuenca...")
with open("data/watershed_boundary.geojson") as fh:
    bdata = json.load(fh)
cuenca = shape(bdata["features"][0]["geometry"])
for ri, ci in zip(*np.where(valid)):
    if not cuenca.contains(Point(float(lon[ri, ci]), float(lat[ri, ci]))):
        valid[ri, ci] = False
print(f"Grid {nr}x{nc}, {valid.sum()} cells en cuenca")

gltf_x = np.full((nr, nc), np.nan)
gltf_y = np.full((nr, nc), np.nan)
for ri, ci in zip(*np.where(valid)):
    east, north = to_utm.transform(float(lon[ri, ci]), float(lat[ri, ci]))
    gltf_x[ri, ci] = east
    gltf_y[ri, ci] = north

cx = np.nanmean(gltf_x)
cy = np.nanmean(gltf_y)
max_ext = max(np.nanmax(gltf_x) - cx, np.nanmax(gltf_y) - cy)
scale = 7000 / max_ext
gltf_x = (gltf_x - cx) * scale
gltf_y = (gltf_y - cy) * scale
print(f"Center UTM: ({cx:.1f}, {cy:.1f})  scale: {scale:.6f}")

grid = np.full((nr, nc), -1, dtype=np.int32)
verts = []
for ri, ci in zip(*np.where(valid)):
    grid[ri, ci] = len(verts)
    verts.append((
        round(float(gltf_x[ri, ci]), 1),
        round(float(gltf_y[ri, ci]), 1),
        round(float(dem[ri, ci]), 1)
    ))

tv = [v for p in verts for v in p]
tris = []
for r in range(nr - 1):
    for c in range(nc - 1):
        i00, i10, i01, i11 = grid[r, c], grid[r + 1, c], grid[r, c + 1], grid[r + 1, c + 1]
        if i00 >= 0 and i10 >= 0 and i01 >= 0 and i11 >= 0:
            I00, I10, I01, I11 = int(i00), int(i10), int(i01), int(i11)
            tris.extend([I00, I10, I11, I00, I11, I01])

print(f"Terrain: {len(verts)} verts, {len(tris) // 3} tris")

target_elevs = list(range(800, 1301, 25))

print("Leyendo polígonos de inundación...")
with open("data/flood_scenarios.geojson") as fh:
    flood = json.load(fh)

flood_by_elev = {}
for feat in flood["features"]:
    elev = feat["properties"]["elevation"]
    flood_by_elev[elev] = shape(feat["geometry"])

def ring_to_local(ring_coords):
    pts = []
    for lon, lat in ring_coords:
        east, north = to_utm.transform(lon, lat)
        lx = round((east - cx) * scale, 1)
        ly = round((north - cy) * scale, 1)
        pts.append([lx, ly])
    if len(pts) >= 3 and pts[0] == pts[-1]:
        pts.pop()
    return pts

def flatten_ring(pts):
    return [c for pt in pts for c in pt]

water = {}
for elev in target_elevs:
    geom = flood_by_elev.get(elev)
    if geom is None:
        continue
    polys = []
    # geom is MultiPolygon
    multi_coords = geom.geoms if hasattr(geom, 'geoms') else [geom]
    for poly in multi_coords:
        ext = flatten_ring(ring_to_local(poly.exterior.coords))
        holes = [flatten_ring(ring_to_local(ring.coords)) for ring in poly.interiors]
        polys.append({"e": ext})
        if holes:
            polys[-1]["h"] = holes
    water[str(elev)] = polys

print(f"Water: {len(water)} elevations with polygon data")

print("Exporting...")
ax = tv[0::3]; ay = tv[1::3]; az = tv[2::3]
scene = {
    "terrain": {"v": tv, "t": tris},
    "water": water,
    "elevs": target_elevs,
    "default": 900,
    "bbox": [round(min(ax), 1), round(min(ay), 1), round(min(az), 1),
             round(max(ax), 1), round(max(ay), 1), round(max(az), 1)],
}

os.makedirs("data", exist_ok=True)
with open("data/escena_3d.json", "w") as f:
    json.dump(scene, f, separators=(',', ':'))

sz = os.path.getsize("data/escena_3d.json") / 1024 / 1024
print(f"Size: {sz:.2f} MB")
print("DONE!")

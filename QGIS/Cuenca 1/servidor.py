#!/usr/bin/env python3
"""Servidor HTTP local para los visores de simulacion."""
import http.server
import socketserver
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
DIR = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)
    
    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {args[0]} {args[1]} {args[2]}")

print(f"Servidor iniciado en http://localhost:{PORT}")
print(f"Directorio: {DIR}")
print(f"\nVisores disponibles:")
print(f"  2D: http://localhost:{PORT}/index_2d.html")
print(f"  3D: http://localhost:{PORT}/index_3d.html")
print(f"\nPresiona Ctrl+C para detener el servidor.")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
        httpd.server_close()

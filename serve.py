#!/usr/bin/env python3
"""
GuitarLab Pro - Local Development Server
Sirve la aplicación localmente y abre el navegador automáticamente.
El servidor local es necesario para que el navegador permita el acceso al micrófono
(navigator.mediaDevices.getUserMedia requiere http://localhost o https://).
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Evitar problemas de caché durante el desarrollo y soportar módulos ES6
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 60)
        print(f"🎸 GuitarLab Pro iniciado exitosamente:")
        print(f"   URL: {url}")
        print(f"   Micrófono habilitado bajo localhost")
        print("   Presiona Ctrl+C para detener el servidor")
        print("=" * 60)
        
        try:
            webbrowser.open(url)
        except Exception:
            pass
            
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido.")

if __name__ == '__main__':
    run()


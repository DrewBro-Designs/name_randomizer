#!/usr/bin/env python3
"""
Simple CORS proxy server for Google Sheets (LOCAL DEVELOPMENT ONLY)

This allows the frontend to fetch data without CORS issues by proxying
requests through a local server that adds the necessary CORS headers.

USAGE:
1. Run this server: python3 proxy_server.py
2. Update script.js to use: var url = "http://localhost:3000/names";
3. Serve the frontend: python3 -m http.server 8000
4. Open: http://localhost:8000/index.html

NOTE: For GitHub Pages deployment, the app uses a third-party CORS proxy
(api.allorigins.win) instead. This local proxy is for development reference.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.request
import urllib.parse

GOOGLE_SHEETS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhNvI9ipnI3Xz6xIhV5eE0scK3xvOxixGgTJQcpF1FmkR5gq-ZzcQXqYoW3yXRJmlfGXZKvWoIFhzO/pub?output=csv"

class CORSProxyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/names':
            try:
                # Fetch data from Google Sheets
                with urllib.request.urlopen(GOOGLE_SHEETS_URL) as response:
                    data = response.read()
                
                # Send response with CORS headers
                self.send_response(200)
                self.send_header('Content-Type', 'text/csv')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET')
                self.end_headers()
                self.wfile.write(data)
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                self.wfile.write(f"Error: {str(e)}".encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    PORT = 3000
    server = HTTPServer(('localhost', PORT), CORSProxyHandler)
    print(f"CORS Proxy server running on http://localhost:{PORT}")
    print(f"Access names at: http://localhost:{PORT}/names")
    server.serve_forever()


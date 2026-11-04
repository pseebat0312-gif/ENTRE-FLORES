from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os, webbrowser
os.chdir(Path(__file__).resolve().parent)
url = "http://127.0.0.1:8765"
print("ENTRE FLORES:", url, flush=True)
webbrowser.open(url)
ThreadingHTTPServer(("127.0.0.1",8765),SimpleHTTPRequestHandler).serve_forever()

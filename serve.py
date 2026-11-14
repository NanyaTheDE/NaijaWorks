"""Local dev server for the NaijaWorks prototype: serves ./prototype with caching disabled.
Usage: python3 serve.py [port]"""
import functools, http.server, os, sys

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "prototype")
handler = functools.partial(NoCache, directory=root)
print(f"NaijaWorks running at http://localhost:{port}")
http.server.ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()

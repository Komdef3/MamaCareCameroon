import httpx

key = "AIzaSyBZ0OGrTSR59gbfPpJp_RKnP8pEjjDDEK0"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"

r = httpx.get(url)
print("Status:", r.status_code)

import json
data = r.json()
models = data.get("models", [])
for m in models:
    print(m.get("name"))
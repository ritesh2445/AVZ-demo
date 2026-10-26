import urllib.request
import re

print("=== TESTING DEV SERVER ENDPOINTS ===")
endpoints = [
    '/',
    '/src/main.jsx',
    '/src/index.css',
    '/assets/avz_logo_official.png',
    '/assets/cat_companion.png',
    '/assets/editorial_hero_portrait.jpg',
    '/assets/product_diva_top.jpg',
    '/assets/product_spike_bra.jpg',
    '/assets/product_beaded_bralette.jpg',
    '/assets/product_reworked_jacket.jpg',
    '/assets/product_coord_set.jpg',
    '/assets/product_spike_top.jpg',
    '/assets/product_archive_bralette.jpg'
]

all_pass = True
for ep in endpoints:
    url = f"http://localhost:5173{ep}"
    try:
        with urllib.request.urlopen(url) as resp:
            data = resp.read()
            status = resp.status
            content_type = resp.headers.get('Content-Type')
            print(f"PASS [Status {status}] {ep} ({len(data)} bytes, {content_type})")
    except Exception as e:
        all_pass = False
        print(f"FAIL {ep}: {e}")

if all_pass:
    print("\nALL ASSETS, SCRIPTS & STYLES SERVED SUCCESSFULLY (HTTP 200)!")

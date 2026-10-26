import re
import json

html_path = r"C:\Users\rites\Downloads\AVZ-Vaganza-Soft-Chaos-Club-Cat-Upgrade.html"
with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

print("HTML size:", len(html))

# Find script blocks
scripts = re.findall(r'<script[\s\S]*?>([\s\S]*?)<\/script>', html, re.IGNORECASE)
print(f"Found {len(scripts)} script tags")

for idx, s in enumerate(scripts):
    print(f"--- Script {idx} (length {len(s)}) ---")
    lines = s.strip().split('\n')
    print("\n".join(lines[:15]))
    if len(lines) > 15:
        print("...")

# Find image tags and data URLs or photos
products_match = re.search(r'const\s+products\s*=\s*(\[[\s\S]*?\]);', html)
if products_match:
    print("Found products array!")
    print(products_match.group(1)[:500])

photo_matches = re.findall(r'const\s+productPhotos\s*=\s*(\[[\s\S]*?\]);', html)
if photo_matches:
    print("Found productPhotos array!")
    print(photo_matches[0][:500])

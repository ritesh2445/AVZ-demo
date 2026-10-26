import re
import os
import base64

html_path = r"C:\Users\rites\Downloads\AVZ-Vaganza-Soft-Chaos-Club-Cat-Upgrade.html"
with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Look for productPhotos = [...]
match = re.search(r'const\s+productPhotos\s*=\s*\[([\s\S]*?)\];', html)
photos = []
if match:
    items = re.findall(r"'(data:image\/[^;]+;base64,[^']+)'", match.group(1))
    photos = items
    print(f"Found {len(photos)} photos in productPhotos array!")

# Also look for any other base64 images (cat, icons, etc.)
all_data_uris = re.findall(r'(data:image\/(?:png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=]+))', html)
print(f"Total base64 data URIs in HTML: {len(all_data_uris)}")

os.makedirs(r"c:\AVZ-1\extracted_assets", exist_ok=True)

# Save the product photos
for i, p in enumerate(photos):
    prefix, b64data = p.split(';base64,')
    ext = 'jpg' if 'jpeg' in prefix or 'jpg' in prefix else 'png'
    out_file = os.path.join(r"c:\AVZ-1\extracted_assets", f"client_photo_{i+1}.{ext}")
    with open(out_file, 'wb') as f:
        f.write(base64.b64decode(b64data))
    print(f"Saved client_photo_{i+1}.{ext} ({os.path.getsize(out_file)} bytes)")

# Also check for other images like cat sprite or graphics
for i, (full_uri, b64str) in enumerate(all_data_uris):
    # check if not already saved
    ext = 'png' if 'png' in full_uri else 'jpg'
    out_file = os.path.join(r"c:\AVZ-1\extracted_assets", f"asset_{i+1}.{ext}")
    with open(out_file, 'wb') as f:
        f.write(base64.b64decode(b64str))
    print(f"Saved asset_{i+1}.{ext} ({os.path.getsize(out_file)} bytes)")

print("\nDone extracting assets.")

import os
import hashlib
import shutil

src_dir = r"c:\AVZ-1\extracted_assets"
dest_dir = r"c:\AVZ-1\public\client_assets"
os.makedirs(dest_dir, exist_ok=True)

hashes = {}
unique_files = []

for f in sorted(os.listdir(src_dir)):
    p = os.path.join(src_dir, f)
    with open(p, 'rb') as fp:
        h = hashlib.md5(fp.read()).hexdigest()
    if h not in hashes:
        hashes[h] = f
        unique_files.append((f, p, h))

print(f"Total unique images extracted: {len(unique_files)}")
for f, p, h in unique_files:
    sz = os.path.getsize(p)
    print(f"  {f}: {sz} bytes (hash {h[:8]})")

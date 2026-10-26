import re
import os

with open(r'C:\Users\rites\Downloads\AVZ-Vaganza-Soft-Chaos-Club-Cat-Upgrade.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# find all img tags
img_tags = re.findall(r'<img\s+[^>]*>', html, re.IGNORECASE)
print(f"Total <img> tags: {len(img_tags)}")
for i, tag in enumerate(img_tags):
    alt = re.search(r'alt="([^"]*)"', tag)
    alt_val = alt.group(1) if alt else 'NO_ALT'
    cls = re.search(r'class="([^"]*)"', tag)
    cls_val = cls.group(1) if cls else 'NO_CLASS'
    src_len = len(re.search(r'src="([^"]*)"', tag).group(1)) if re.search(r'src="([^"]*)"', tag) else 0
    print(f"Tag {i}: class='{cls_val}', alt='{alt_val}', src_len={src_len}")

# Let's inspect CSS backgrounds
css_bgs = re.findall(r'background(?:-image)?:\s*url\(([^)]+)\)', html)
print(f"Total CSS background urls: {len(css_bgs)}")
for i, bg in enumerate(css_bgs):
    print(f"CSS BG {i}: len={len(bg)}")

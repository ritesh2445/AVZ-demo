from PIL import Image

# Save clean named versions of these assets
named_assets = {
    "avz_logo_official.png": "asset_1.png",
    "cat_companion.png": "asset_5.png",
    "editorial_hero_portrait.jpg": "asset_7.jpg",
    "editorial_lookbook_ref.jpg": "asset_2.png",
    "product_diva_top.jpg": "asset_8.jpg",
    "product_spike_bra.jpg": "asset_9.jpg",
    "product_beaded_bralette.jpg": "asset_10.jpg",
    "product_reworked_jacket.jpg": "asset_11.jpg",
    "product_coord_set.jpg": "asset_12.jpg",
    "product_spike_top.jpg": "asset_13.jpg",
    "product_archive_bralette.jpg": "asset_14.jpg"
}

import os, shutil

dest = r"c:\AVZ-1\public\assets"
os.makedirs(dest, exist_ok=True)

src_dir = r"c:\AVZ-1\extracted_assets"
for target_name, source_file in named_assets.items():
    s = os.path.join(src_dir, source_file)
    d = os.path.join(dest, target_name)
    shutil.copyfile(s, d)
    print(f"Copied {source_file} -> {target_name} ({os.path.getsize(d)} bytes)")

# Also copy avz_logo_official.png to root public as well
shutil.copyfile(os.path.join(dest, "avz_logo_official.png"), r"c:\AVZ-1\public\logo.png")
print("Assets organized successfully.")

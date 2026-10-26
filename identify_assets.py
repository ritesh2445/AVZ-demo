import os
from PIL import Image

assets_dir = r"c:\AVZ-1\extracted_assets"
files = sorted(os.listdir(assets_dir))

for f in files:
    p = os.path.join(assets_dir, f)
    with Image.open(p) as img:
        print(f"{f}: size={img.size}, mode={img.mode}, format={img.format}")

# Let's inspect what is in asset_1, asset_5, asset_7
# asset_1: logo? (1268, 1826)
# asset_5: cat sprite? (420, 250)
# asset_7: founder/model photo? (832, 1152)
# client_photo_1..7: the 7 product photos

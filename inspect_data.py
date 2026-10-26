import re
import csv
import os

print("=== INSPECTING CSV ===")
csv_path = r"c:\AVZ-1\AVZ _ Client Questionnaire & Asset Collection.csv"
if os.path.exists(csv_path):
    with open(csv_path, 'r', encoding='utf-8', errors='ignore') as f:
        reader = csv.reader(f)
        for i, row in enumerate(reader):
            if i < 40:
                print(f"Row {i}: {row[:4]}")
            elif i == 40:
                print("... more rows")

print("\n=== INSPECTING HTML ===")
html_path = r"C:\Users\rites\Downloads\AVZ-Vaganza-Soft-Chaos-Club-Cat-Upgrade.html"
if os.path.exists(html_path):
    with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    print("HTML length:", len(content))
    img_matches = re.findall(r'src=["\']([^"\']+)["\']', content)
    print("Total src matches:", len(img_matches))
    non_data = [m for m in img_matches if not m.startswith('data:')]
    print("Non-data sources:", len(non_data), non_data[:10])
    data_uris = [m for m in img_matches if m.startswith('data:')]
    print("Data URIs count:", len(data_uris))
    bg_matches = re.findall(r'url\(["\']?([^"\')]+)["\']?\)', content)
    print("Background URLs:", len(bg_matches))
    bg_data = [m for m in bg_matches if m.startswith('data:')]
    print("Background data URIs:", len(bg_data))

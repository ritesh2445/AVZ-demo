import csv
import json

csv_path = r"c:\AVZ-1\AVZ _ Client Questionnaire & Asset Collection.csv"
with open(csv_path, 'r', encoding='utf-8', errors='ignore') as f:
    reader = csv.reader(f)
    rows = list(reader)

headers = rows[0]
data = rows[1] if len(rows) > 1 else []

result = []
for h, d in zip(headers, data):
    result.append({"question": h.strip(), "answer": d.strip()})

with open(r"c:\AVZ-1\questionnaire_parsed.json", "w", encoding="utf-8") as out:
    json.dump(result, out, indent=2)

print(f"Total questions/fields parsed: {len(result)}")
for idx, item in enumerate(result):
    if item['answer']:
        print(f"[{idx}] {item['question'][:60]} => {item['answer'][:100]}")

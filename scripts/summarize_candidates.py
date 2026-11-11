import json
import sys

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

with open("xhs_results.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for char, cards in data.items():
    print(f"\n=== {char.upper()} ===")
    for c in cards:
        author = c['author'].replace('\n', ' ')
        print(f"[{c['index']}] {c['title']} | 作者: {author} | 链接: {c['link']}")

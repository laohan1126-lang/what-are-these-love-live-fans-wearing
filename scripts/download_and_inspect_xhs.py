import json
import os
import sys
import urllib.request
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

HEADERS = {
    "Referer": "https://www.xiaohongshu.com/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

with open("xhs_results.json", "r", encoding="utf-8") as f:
    data = json.load(f)

os.makedirs("d:/lovelive！/temp_xhs", exist_ok=True)

print("Starting download of candidate images...")
for char_key, cards in data.items():
    print(f"\nProcessing {char_key} ({len(cards)} items)...")
    for idx, card in enumerate(cards):
        cover = card.get("cover")
        if not cover:
            continue
        # Remove suffix to get higher res if possible or use clean URL
        clean_url = cover.split("!")[0]
        # Download both clean_url and cover
        filename = f"{char_key}_{idx}.jpg"
        save_path = os.path.join("d:/lovelive！/temp_xhs", filename)
        
        # Try clean_url first, if 403 or fail try cover
        downloaded = False
        for target_url in [clean_url, cover]:
            try:
                req = urllib.request.Request(target_url, headers=HEADERS)
                with urllib.request.urlopen(req, timeout=10) as resp:
                    raw = resp.read()
                    with open(save_path + ".tmp", "wb") as tf:
                        tf.write(raw)
                    with Image.open(save_path + ".tmp") as im:
                        im.convert("RGB").save(save_path, "JPEG", quality=95)
                        w, h = im.size
                        print(f"  [{idx}] {filename} ({w}x{h}, {len(raw)}B) - {card['title']} (by {card['author'].splitlines()[0]})")
                        downloaded = True
                        break
            except Exception as e:
                # print(f"    failed {target_url[:50]}: {e}")
                pass
        if not downloaded:
            print(f"  [{idx}] FAILED: {card['title']}")

print("\nDone downloading candidates.")

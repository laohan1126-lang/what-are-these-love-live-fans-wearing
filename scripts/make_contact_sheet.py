import os
from PIL import Image, ImageDraw, ImageFont

CHARS = ["chika", "lanzhu", "shioriko", "ayumu", "honoka"]
BASE_DIR = "d:/lovelive！/temp_xhs"

for char in CHARS:
    imgs = []
    for i in range(6):
        p = os.path.join(BASE_DIR, f"{char}_{i}.jpg")
        if os.path.exists(p):
            with Image.open(p) as im:
                # Resize keeping ratio
                im.thumbnail((300, 450))
                imgs.append((i, im.copy()))
    if not imgs:
        continue
    
    # Create contact row
    total_w = sum(im.size[0] for _, im in imgs) + (len(imgs) - 1) * 10
    max_h = max(im.size[1] for _, im in imgs) + 40
    sheet = Image.new("RGB", (total_w, max_h), (20, 24, 33))
    draw = ImageDraw.Draw(sheet)
    
    x = 0
    for idx, im in imgs:
        sheet.paste(im, (x, 30))
        draw.text((x + 10, 8), f"#{idx} ({im.size[0]}x{im.size[1]})", fill=(200, 220, 255))
        x += im.size[0] + 10
        
    out_path = os.path.join(BASE_DIR, f"{char}_contact.jpg")
    sheet.save(out_path, "JPEG", quality=90)
    print(f"Generated contact sheet: {out_path}")

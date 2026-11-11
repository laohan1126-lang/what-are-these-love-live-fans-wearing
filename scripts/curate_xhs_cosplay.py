import asyncio
import json
import os
import sys
import urllib.parse
import urllib.request
from PIL import Image
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

USER_DATA_DIR = r"D:\AI PROJECTS\photography-reference-lab\.local\playwright-collection-profile"
OUTPUT_DIR = r"D:\lovelive！\data\uploads"
PUBLIC_DIR = r"D:\lovelive！\public\uploads"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)

HEADERS = {
    "Referer": "https://www.xiaohongshu.com/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def download_image(url: str, save_path: str) -> bool:
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            with open(save_path, "wb") as f:
                f.write(data)
        
        # Verify with PIL and convert to JPG if needed
        try:
            with Image.open(save_path) as im:
                w, h = im.size
                format_name = im.format
                print(f"Downloaded: {os.path.basename(save_path)} ({w}x{h}, {len(data)} bytes, {format_name})")
                
                # If webp or png, also convert/save as clean jpg
                jpg_path = os.path.splitext(save_path)[0] + ".jpg"
                rgb_im = im.convert("RGB")
                rgb_im.save(jpg_path, "JPEG", quality=95)
                # Sync to public
                pub_jpg = os.path.join(PUBLIC_DIR, os.path.basename(jpg_path))
                rgb_im.save(pub_jpg, "JPEG", quality=95)
                return True
        except Exception as e:
            print(f"PIL verification failed for {save_path}: {e}")
            return False
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

async def search_and_extract(page, keyword: str, limit: int = 8):
    print(f"\n==========================================")
    print(f"Searching: {keyword}")
    print(f"==========================================")
    encoded = urllib.parse.quote(keyword)
    url = f"https://www.xiaohongshu.com/search_result?keyword={encoded}&source=web_search_result_notes"
    await page.goto(url, wait_until="domcontentloaded", timeout=30000)
    await asyncio.sleep(4)
    
    # Get note list
    cards = await page.evaluate('''() => {
        const items = Array.from(document.querySelectorAll('section.note-item, div.note-item'));
        return items.slice(0, 15).map((el, i) => {
            const titleEl = el.querySelector('.title, .footer .title, a.title');
            const authorEl = el.querySelector('.author, .name');
            const imgEl = el.querySelector('img');
            const linkEl = el.querySelector('a[href*="/explore/"]');
            return {
                index: i,
                title: titleEl ? titleEl.innerText.trim() : '',
                author: authorEl ? authorEl.innerText.trim() : '',
                cover: imgEl ? imgEl.src : '',
                link: linkEl ? linkEl.href : ''
            };
        });
    }''')
    
    print(f"Found {len(cards)} cards on search page.")
    results = []
    
    for c in cards[:limit]:
        if not c.get("title") and not c.get("cover"):
            continue
        print(f"[{c['index']}] {c['title']} by {c['author']}")
        
        # Click the card to open modal and get high-res images
        try:
            clicked = await page.evaluate(f'''(idx) => {{
                const items = Array.from(document.querySelectorAll('section.note-item, div.note-item'));
                if (items[idx]) {{
                    const cover = items[idx].querySelector('.cover, .image-wrapper, img, a');
                    if (cover) {{
                        cover.click();
                        return true;
                    }}
                }}
                return false;
            }}''', c['index'])
            
            if clicked:
                await asyncio.sleep(2.5)
                # Extract modal images and note info
                modal_data = await page.evaluate('''() => {
                    const res = {
                        title: '',
                        desc: '',
                        images: []
                    };
                    const titleEl = document.querySelector('.note-container .title, .interaction-container .title');
                    if (titleEl) res.title = titleEl.innerText.trim();
                    
                    const descEl = document.querySelector('.note-container .desc, .interaction-container .desc');
                    if (descEl) res.desc = descEl.innerText.trim();
                    
                    // Look for high-res images in slider / media container
                    const imgEls = document.querySelectorAll('.note-container .media-container img, .note-container .swiper-slide img');
                    imgEls.forEach(img => {
                        if (img.src && !img.src.includes('avatar') && !res.images.includes(img.src)) {
                            res.images.push(img.src);
                        }
                    });
                    
                    return res;
                }''')
                
                # Close modal
                await page.keyboard.press("Escape")
                await asyncio.sleep(1)
                
                imgs = modal_data.get("images", [])
                if not imgs and c.get("cover"):
                    imgs = [c["cover"]]
                
                c["modal_title"] = modal_data.get("title", "")
                c["desc"] = modal_data.get("desc", "")
                c["images"] = imgs
                results.append(c)
                print(f"    Modal images: {len(imgs)}, desc: {c['desc'][:60]}")
            else:
                if c.get("cover"):
                    c["images"] = [c["cover"]]
                    results.append(c)
        except Exception as e:
            print(f"    Failed to open modal for {c['index']}: {e}")
            if c.get("cover"):
                c["images"] = [c["cover"]]
                results.append(c)
                
    return results

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch_persistent_context(
            user_data_dir=USER_DATA_DIR,
            headless=True,
            viewport={"width": 1280, "height": 900},
            args=["--disable-blink-features=AutomationControlled"]
        )
        page = await browser.new_page()
        
        searches = [
            ("chika", "高海千歌 青空Jumping Heart cos"),
            ("lanzhu", "钟岚珠 colorful dreams cos"),
            ("shioriko", "三船栞子 决意之光 cos"),
            ("ayumu", "上原步梦 梦的一步 cos"),
            ("honoka", "高坂穗乃果 我们的live cos")
        ]
        
        all_data = {}
        for key, kw in searches:
            data = await search_and_extract(page, kw, limit=6)
            all_data[key] = data
            
        with open("xhs_results.json", "w", encoding="utf-8") as f:
            json.dump(all_data, f, ensure_ascii=False, indent=2)
            
        print("\nFinished collecting. Saved metadata to xhs_results.json")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

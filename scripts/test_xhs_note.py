import asyncio
import json
import os
import sys
import urllib.parse
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

USER_DATA_DIR = r"D:\AI PROJECTS\photography-reference-lab\.local\playwright-collection-profile"

async def test_note(note_url: str):
    print(f"Testing note: {note_url}")
    async with async_playwright() as p:
        browser = await p.chromium.launch_persistent_context(
            user_data_dir=USER_DATA_DIR,
            headless=True,
            viewport={"width": 1280, "height": 900},
            args=["--disable-blink-features=AutomationControlled"]
        )
        page = await browser.new_page()
        try:
            await page.goto(note_url, wait_until="domcontentloaded", timeout=25000)
            await asyncio.sleep(4)
            
            # Extract images from note
            imgs = await page.evaluate('''() => {
                // Check swiper or main image
                const images = [];
                const imgEls = document.querySelectorAll('.note-content img, .media-container img, .swiper-slide img');
                imgEls.forEach(el => {
                    if (el.src && !el.src.includes('avatar')) {
                        images.push(el.src);
                    }
                });
                return Array.from(new Set(images));
            }''')
            print("Extracted note images:", imgs)
        except Exception as e:
            print("Error:", e)
        finally:
            await browser.close()

if __name__ == "__main__":
    url = "https://www.xiaohongshu.com/explore/69d472fa000000002301efd3"
    asyncio.run(test_note(url))

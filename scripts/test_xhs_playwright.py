import asyncio
import json
import os
import sys
import urllib.parse
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

USER_DATA_DIR = r"D:\AI PROJECTS\photography-reference-lab\.local\playwright-collection-profile"

async def test_search(keyword: str):
    print(f"Testing search for: {keyword}")
    async with async_playwright() as p:
        browser = await p.chromium.launch_persistent_context(
            user_data_dir=USER_DATA_DIR,
            headless=True,
            viewport={"width": 1280, "height": 800},
            args=["--disable-blink-features=AutomationControlled"]
        )
        page = await browser.new_page()
        encoded_kw = urllib.parse.quote(keyword)
        url = f"https://www.xiaohongshu.com/search_result?keyword={encoded_kw}&source=web_search_result_notes"
        print(f"Navigating to: {url}")
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=25000)
            await asyncio.sleep(5)
            
            # Check title and current url
            title = await page.title()
            print(f"Page title: {title}, URL: {page.url}")
            
            # Extract note cards
            cards = await page.evaluate('''() => {
                const items = Array.from(document.querySelectorAll('section.note-item, div.note-item'));
                return items.slice(0, 10).map((el, i) => {
                    const titleEl = el.querySelector('.title, .footer .title, a.title');
                    const imgEl = el.querySelector('img');
                    const linkEl = el.querySelector('a[href*="/explore/"]');
                    return {
                        index: i,
                        title: titleEl ? titleEl.innerText.trim() : '',
                        img: imgEl ? imgEl.src : '',
                        link: linkEl ? linkEl.href : ''
                    };
                });
            }''')
            print(f"Found {len(cards)} cards:")
            for c in cards:
                print(" -", c)
        except Exception as e:
            print("Error:", e)
        finally:
            await browser.close()

if __name__ == "__main__":
    kw = sys.argv[1] if len(sys.argv) > 1 else "高海千歌 青空Jumping Heart cos"
    asyncio.run(test_search(kw))

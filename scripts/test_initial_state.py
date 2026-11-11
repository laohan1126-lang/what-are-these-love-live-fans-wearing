import asyncio
import json
import sys
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

USER_DATA_DIR = r"D:\AI PROJECTS\photography-reference-lab\.local\playwright-collection-profile"

async def test_initial_state(note_url: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch_persistent_context(
            user_data_dir=USER_DATA_DIR,
            headless=True,
            viewport={"width": 1280, "height": 900},
            args=["--disable-blink-features=AutomationControlled"]
        )
        page = await browser.new_page()
        await page.goto(note_url, wait_until="domcontentloaded", timeout=25000)
        await asyncio.sleep(4)
        
        state = await page.evaluate('''() => {
            if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.note) {
                const note = window.__INITIAL_STATE__.note.noteDetailMap;
                return note;
            }
            return null;
        }''')
        if state:
            for k, v in state.items():
                print("Note ID:", k)
                note_data = v.get("note", {})
                print("Title:", note_data.get("title"))
                print("Desc:", note_data.get("desc")[:100] if note_data.get("desc") else "")
                image_list = note_data.get("imageList", [])
                print(f"ImageList count: {len(image_list)}")
                for img in image_list:
                    print(" - InfoList:", img.get("infoList", [])[:2])
                    print(" - urlDefault:", img.get("urlDefault"))
        else:
            print("No __INITIAL_STATE__.note found")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_initial_state("https://www.xiaohongshu.com/explore/69d472fa000000002301efd3"))

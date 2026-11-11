import urllib.request
import ssl
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0'}

imgs = [
    'https://cdn.gamerch.com/contents/wiki/4839/entry/QVnM7xuV.jpg',
    'https://cdn.gamerch.com/contents/wiki/4839/entry/I5AfmZdn.jpg',
    'https://cdn.gamerch.com/contents/wiki/4839/entry/nDdW1yQS.jpg'
]

for url in imgs:
    fname = f'tmp_rurino/{os.path.basename(url)}'
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as r:
        with open(fname, 'wb') as f:
            f.write(r.read())
    print(f'Saved {fname}, size: {os.path.getsize(fname)}')

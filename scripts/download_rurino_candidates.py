import urllib.request
import ssl
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0'}

imgs = [
    'https://cdn.gamerch.com/contents/wiki/3029/entry/zPEop60P.jpg',
    'https://cdn.gamerch.com/contents/wiki/3029/entry/Cvva4kaX.jpg',
    'https://cdn.gamerch.com/contents/wiki/3029/entry/8lfxuxay.jpg',
    'https://cdn.gamerch.com/contents/wiki/3029/entry/zFJ4LWXM.jpg',
    'https://cdn.gamerch.com/contents/wiki/3029/entry/weEC2QtS.jpg'
]

os.makedirs('tmp_rurino', exist_ok=True)
for i, url in enumerate(imgs):
    fname = f'tmp_rurino/rurino_{i}_{os.path.basename(url)}'
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as r:
        with open(fname, 'wb') as f:
            f.write(r.read())
    print(f'Saved {fname}, size: {os.path.getsize(fname)}')

import urllib.request
import ssl
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0'}

base = 'https://llwiki.org'
urls = [
    'https://llwiki.org/mediawiki/img_auth.php/2/20/KEY_of_Like%EF%BC%81.jpg',
    'https://llwiki.org/mediawiki/img_auth.php/6/60/KEY_of_Like%EF%BC%81_%28LLLL%29.jpg'
]

for url in urls:
    fname = f'tmp_rurino/{os.path.basename(urllib.parse.unquote(url))}'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx) as r:
            with open(fname, 'wb') as f:
                f.write(r.read())
        print(f'Saved {fname}, size: {os.path.getsize(fname)}')
    except Exception as e:
        print(f'Error {url}: {e}')

import urllib.request
import re
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(
    'https://llwiki.org/zh/KEY_of_Like%EF%BC%81',
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)
try:
    with urllib.request.urlopen(req, context=ctx) as r:
        html = r.read().decode('utf-8')
        imgs = re.findall(r'src="([^"]+\.(?:png|jpg|jpeg|webp))"', html)
        print('Images on LLWiki:', imgs[:10])
except Exception as e:
    print('Error:', e)

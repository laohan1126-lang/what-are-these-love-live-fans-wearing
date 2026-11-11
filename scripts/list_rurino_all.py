import urllib.request
import re
import ssl

url = 'https://gamerch.com/lllovelive/812263'
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
with urllib.request.urlopen(req, context=ctx) as r:
    html = r.read().decode('utf-8')
    a_tags = re.findall(r'<a[^>]+href="(/lllovelive/\d+)"[^>]*>(.*?)</a>', html, re.DOTALL)
    for href, text in a_tags[:15]:
        print(href, repr(text[:60]))

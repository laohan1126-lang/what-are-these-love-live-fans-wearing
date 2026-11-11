import urllib.request
import re
import ssl

url = 'https://gamerch.com/lllovelive/entry/756858' # or character list
# let's search gamerch for all entries of 大沢瑠璃乃
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('https://gamerch.com/lllovelive/807490', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, context=ctx) as r:
        html = r.read().decode('utf-8')
        # find all cards of rurino
        cards = re.findall(r'href="(/lllovelive/\d+)"[^>]*>([^<]*大沢瑠璃乃[^<]*)', html)
        print('Cards of Rurino:', len(cards), cards[:15])
except Exception as e:
    print('Error:', e)

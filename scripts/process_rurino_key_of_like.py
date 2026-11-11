from PIL import Image

# Open cover
im = Image.open('tmp_rurino/KEY_of_Like！.jpg')
w, h = im.size
print('Cover size:', w, h)

# In the cover:
# Rurino is front left:
# Let's crop Rurino's region:
# (left, upper, right, lower)
# Rurino is around x: 10% to 45%, y: 40% to 90%
rurino_crop = im.crop((int(w * 0.05), int(h * 0.40), int(w * 0.45), int(h * 0.95)))
rurino_crop.save('tmp_rurino/rurino_key_of_like_focus.jpg', quality=95)

# Also let's save the full official art
im.save('public/uploads/key_of_like_official_full.jpg', quality=95)
rurino_crop.save('public/uploads/rurino_key_of_like_2d.jpg', quality=95)

print('Saved rurino_key_of_like_2d.jpg successfully')

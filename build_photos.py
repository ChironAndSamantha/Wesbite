from pathlib import Path
from PIL import Image, ImageOps
import json, shutil

root = Path(__file__).resolve().parent
source = root.parent / 'Engagement party photos'
if not source.exists():
    source = root / 'photos'
for directory in ['photos', 'thumbnails', 'img']:
    (root / directory).mkdir(exist_ok=True)
photos = []
for index, path in enumerate(sorted(source.glob('*.jpg')), 1):
    if path.resolve() != (root / 'photos' / path.name).resolve():
        shutil.copy2(path, root / 'photos' / path.name)
    with Image.open(path) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        image.thumbnail((640, 640))
        image.save(root / 'thumbnails' / path.name, quality=82, optimize=True)
    photos.append({'name': path.name, 'label': f'Photo {index:03d}', 'bytes': path.stat().st_size})
hero_source = root.parent / 'img' / 'Chiron+Sam-21.jpg'
if not hero_source.exists():
    hero_source = root / 'img' / 'Chiron+Sam-21.jpg'
with Image.open(hero_source) as original:
    image = ImageOps.exif_transpose(original).convert('RGB')
    image.thumbnail((2000, 2000))
    image.save(root / 'img' / 'hero.jpg', quality=88, optimize=True)
(root / 'photos.js').write_text('const PHOTOS = ' + json.dumps(photos) + ';\n', encoding='utf-8')
print(f'Prepared {len(photos)} original photos and thumbnails.')

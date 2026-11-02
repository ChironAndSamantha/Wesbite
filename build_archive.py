from pathlib import Path
from zipfile import ZipFile, ZIP_STORED
import json

root = Path(__file__).resolve().parent
photos = json.loads((root / 'photos.js').read_text(encoding='utf-8').removeprefix('const PHOTOS = ').strip().removesuffix(';'))
output = root / 'downloads' / 'Chiron-and-Samantha-all-photos.zip'
output.parent.mkdir(exist_ok=True)
with ZipFile(output, 'w', compression=ZIP_STORED) as archive:
    for photo in photos:
        archive.write(root / 'photos' / photo['name'], photo['name'])
with ZipFile(output) as archive:
    assert len(archive.infolist()) == len(photos)
    assert archive.testzip() is None
print(f'Created and verified {len(photos)} photos: {output} ({output.stat().st_size / 1_000_000:.1f} MB)')

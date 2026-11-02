'use strict';
// Standard ZIP (stored entries): JPEG originals are already compressed.
// No external library or upload service is needed.
const zipCRCTable = Array.from({length:256}, (_, n) => {
  for (let bit = 0; bit < 8; bit++) n = (n & 1) ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
  return n >>> 0;
});
async function createPhotoZip(photos, readPhoto) {
  const parts = [], directory = [];
  let offset = 0;
  const encoder = new TextEncoder();
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i], name = encoder.encode(photo.name);
    const bytes = await readPhoto(photo, i);
    let crc = 0xffffffff;
    for (let n = 0; n < bytes.length; n++) crc = zipCRCTable[(crc ^ bytes[n]) & 255] ^ (crc >>> 8);
    crc = (crc ^ 0xffffffff) >>> 0;
    const header = new Uint8Array(30 + name.length), view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true); view.setUint16(4, 20, true);
    view.setUint16(6, 0x800, true); view.setUint16(12, 0x5d5f, true); // 31 Oct 2026
    view.setUint32(14, crc, true); view.setUint32(18, bytes.length, true); view.setUint32(22, bytes.length, true);
    view.setUint16(26, name.length, true); header.set(name, 30);
    const central = new Uint8Array(46 + name.length), cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x800, true); cv.setUint16(14, 0x5d5f, true);
    cv.setUint32(16, crc, true); cv.setUint32(20, bytes.length, true); cv.setUint32(24, bytes.length, true);
    cv.setUint16(28, name.length, true); cv.setUint32(42, offset, true); central.set(name, 46);
    parts.push(header, bytes); directory.push(central); offset += header.length + bytes.length;
  }
  const directorySize = directory.reduce((sum, entry) => sum + entry.length, 0);
  const end = new Uint8Array(22), ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, photos.length, true); ev.setUint16(10, photos.length, true);
  ev.setUint32(12, directorySize, true); ev.setUint32(16, offset, true);
  return new Blob([...parts, ...directory, end], {type:'application/zip'});
}

'use strict';
const byId = id => document.getElementById(id);
// Start of the wedding date in Sydney (AEDT); no ceremony time is implied.
const wedding = new Date('2028-10-28T00:00:00+11:00').getTime();
function updateCountdown() {
  let remaining = Math.max(0, Math.floor((wedding - Date.now()) / 1000));
  for (const [id, divisor] of [['days',86400],['hours',3600],['minutes',60],['seconds',1]]) {
    byId(id).textContent = String(Math.floor(remaining / divisor)).padStart(2, '0');
    remaining %= divisor;
  }
  if (Date.now() >= wedding) byId('countdown-caption').textContent = 'Our wedding day is here — 28 October 2028!';
}
updateCountdown();
setInterval(updateCountdown, 1000);
const photoURL = (photo, thumbnail = false) => (thumbnail ? 'thumbnails/' : 'photos/') + encodeURIComponent(photo.name);
const selected = new Set();
let preparing = false;
let zipURL = null;
function discardZip() {
  if (zipURL) URL.revokeObjectURL(zipURL);
  zipURL = null;
  byId('zip-ready').hidden = true;
}
function updateSelection() {
  const count = selected.size;
  byId('selection-bar').hidden = count === 0;
  document.body.classList.toggle('has-selection', count > 0);
  byId('download-selected').textContent = `Download ${count} ${count === 1 ? 'image' : 'images'}`;
  byId('download-selected').disabled = preparing || !count;
  byId('clear-selection').disabled = preparing;
}
byId('clear-selection').addEventListener('click', () => {
  selected.clear(); discardZip();
  document.querySelectorAll('.photo-select-input').forEach(input => { input.checked = false; input.closest('.photo-card').classList.remove('selected'); });
  byId('selection-status').textContent = ''; updateSelection();
});
byId('download-selected').addEventListener('click', async () => {
  if (preparing || !selected.size) return;
  preparing = true; discardZip(); updateSelection();
  document.querySelectorAll('.photo-select-input').forEach(input => { input.disabled = true; });
  const photos = [...selected].sort((a,b) => a-b).map(index => PHOTOS[index]);
  try {
    const zip = await createPhotoZip(photos, async (photo, index) => {
      byId('selection-status').textContent = `Preparing ${index + 1} of ${photos.length} photos…`;
      const response = await fetch(photoURL(photo));
      if (!response.ok) throw new Error('Photo could not be loaded');
      return new Uint8Array(await response.arrayBuffer());
    });
    zipURL = URL.createObjectURL(zip);
    const link = byId('zip-ready');
    link.href = zipURL; link.download = 'Chiron-and-Samantha-engagement-photos.zip'; link.hidden = false;
    link.click();
    byId('selection-status').textContent = 'Your ZIP is ready. If the download hasn’t started, tap Save ZIP to device.';
  } catch (error) {
    byId('selection-status').textContent = 'We couldn’t prepare the ZIP. Please try again, select fewer photos, or use the individual download links.';
  } finally {
    preparing = false; updateSelection();
    document.querySelectorAll('.photo-select-input').forEach(input => { input.disabled = false; });
  }
});
let shown = 0;
function loadMore() {
  const end = Math.min(shown + 24, PHOTOS.length);
  for (let i = shown; i < end; i++) {
    const photo = PHOTOS[i];
    const card = document.createElement('article');
    card.className = 'photo-card';
    const label = document.createElement('label'); label.className = 'photo-select-label';
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.className = 'photo-select-input';
    checkbox.checked = selected.has(i); checkbox.disabled = preparing;
    card.classList.toggle('selected', checkbox.checked);
    checkbox.setAttribute('aria-label', `Select ${photo.label} for download`);
    const selectText = document.createElement('span'); selectText.textContent = 'Select';
    label.append(checkbox, selectText);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selected.add(i); else selected.delete(i);
      card.classList.toggle('selected', checkbox.checked);
      discardZip(); byId('selection-status').textContent = ''; updateSelection();
    });
    const button = document.createElement('button');
    button.className = 'photo-open';
    button.setAttribute('aria-label', `View ${photo.label}, ${photo.name}`);
    const img = document.createElement('img');
    img.src = photoURL(photo, true);
    img.alt = `Engagement party — ${photo.label}`;
    img.loading = 'lazy'; img.decoding = 'async';
    button.append(img);
    button.addEventListener('click', () => openPhoto(i));
    const info = document.createElement('div'); info.className = 'photo-info';
    const title = document.createElement('strong'); title.textContent = photo.label;
    const filename = document.createElement('span'); filename.className = 'filename'; filename.textContent = photo.name;
    const download = document.createElement('a'); download.href = photoURL(photo); download.download = photo.name;
    download.textContent = `Download · ${(photo.bytes / 1000000).toFixed(1)} MB`;
    download.setAttribute('aria-label', `Download original ${photo.label}, ${photo.name}`);
    info.append(title, filename, download); card.append(label, button, info); byId('photo-grid').append(card);
  }
  shown = end;
  byId('gallery-count').textContent = `Showing ${shown} of ${PHOTOS.length} photos`;
  byId('load-more').hidden = shown === PHOTOS.length;
}
loadMore(); byId('load-more').addEventListener('click', loadMore);
const dialog = byId('photo-dialog');
let active = 0;
let shareFile = null;
let requestNumber = 0;
function openPhoto(index) {
  active = (index + PHOTOS.length) % PHOTOS.length;
  const photo = PHOTOS[active];
  const request = ++requestNumber;
  shareFile = null; byId('share-photo').hidden = true;
  byId('photo-title').textContent = `${photo.label} of ${PHOTOS.length}`;
  byId('large-photo').src = photoURL(photo);
  byId('large-photo').alt = `Engagement party — ${photo.label}`;
  byId('photo-filename').textContent = photo.name;
  byId('download-photo').href = photoURL(photo); byId('download-photo').download = photo.name;
  byId('open-original').href = photoURL(photo);
  byId('save-status').textContent = 'On iPhone: use Save / Share, or open the original and touch and hold to save to Photos.';
  if (!dialog.open) { dialog.showModal(); document.body.classList.add('modal-open'); }
  // Preload one file so the native share sheet opens directly from a user tap.
  if (navigator.share && navigator.canShare && window.isSecureContext) {
    fetch(photoURL(photo)).then(response => { if (!response.ok) throw new Error('Photo unavailable'); return response.blob(); }).then(blob => {
      if (request !== requestNumber || !dialog.open) return;
      const file = new File([blob], photo.name, {type:'image/jpeg'});
      if (navigator.canShare({files:[file]})) { shareFile = file; byId('share-photo').hidden = false; }
    }).catch(() => { /* Direct original links remain available. */ });
  }
}
byId('share-photo').addEventListener('click', async () => {
  if (!shareFile) return;
  try { await navigator.share({files:[shareFile]}); }
  catch (error) { if (error.name !== 'AbortError') byId('save-status').textContent = 'Sharing is unavailable here. Use Download original, or open the original and save the image.'; }
});
byId('close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); shareFile = null; ++requestNumber; byId('large-photo').removeAttribute('src'); });
byId('previous').addEventListener('click', () => openPhoto(active - 1));
byId('next').addEventListener('click', () => openPhoto(active + 1));
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); openPhoto(active - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); openPhoto(active + 1); }
});

# Chiron & Samantha — November website build

This folder is a self-contained replacement website. The original website outside this folder has not been changed.

## Preview and publish

### Full-gallery ZIP on GitHub Pages

The Download all button uses a prebuilt 365 MB ZIP, so visitors do not have to build the full archive in their browser. Generate it with `python build_archive.py`. The ZIP is in downloads/Chiron-and-Samantha-all-photos.zip and is excluded from Git by .gitignore: it exceeds GitHub's 100 MiB Git-file limit.

The Download all button is configured for:
https://github.com/ChironAndSamantha/Wesbite/releases/download/party-photos/Chiron-and-Samantha-all-photos.zip

To activate it:
1. Open https://github.com/ChironAndSamantha/Wesbite/releases/new
2. Create a release with the exact tag `party-photos` (or edit that release if it already exists).
3. Attach `downloads/Chiron-and-Samantha-all-photos.zip` from this build folder, keeping that exact filename.
4. Publish the release. The release asset must be publicly downloadable for guests.
5. Open the Download all link to confirm the ZIP downloads before publishing the updated website.

This release upload has not been performed or verified. The configured link will only work once that release asset exists. Do not use GitHub's automatically generated source-code ZIP or commit the photo ZIP into the repository.
Individual downloads and checkbox selection downloads remain available. Regenerate and re-upload the full ZIP whenever the gallery changes.

Open index.html to browse locally, or run `python -m http.server 8080` from this folder and visit http://localhost:8080. Upload the contents of this folder to your website hosting when you are ready. Keep index.html, styles.css, app.js, photos.js, zip.js, img/, photos/, and thumbnails/ together. The Python script and this README do not need to be uploaded.

Use HTTPS for the native Save / Share option. That option appears only on browsers that support sharing image files. All photos also have ordinary same-site JPG download links and an Open original fallback. iPhone browsers may save downloads to Files rather than Photos; the page explains how to save an image to Photos.

The gallery contains 163 original JPGs, with small thumbnails for browsing and 24 photos shown at a time. No guest upload service or backend is required. Each photo has a selection checkbox. A floating bar counts selected photos and downloads their original JPGs together in one ZIP file. Selections persist while loading more photos. A Save ZIP to device link remains available if the automatic download does not start. ZIPs are prepared locally in the browser; selecting a large number of originals requires more device memory. On iPhone, open the downloaded ZIP in Files to extract the photos. Downloads retain the original quality and filenames.

The countdown targets the start of 28 October 2028 in Australia/Sydney (UTC+11). This is a date countdown, not a ceremony time. Invitations are announced for 2027.

To refresh the photos, add JPGs to the original Engagement party photos folder and run `python build_photos.py` from this folder (requires Pillow). Existing generated files are retained; remove any retired photo files manually from this build before publishing.

Desktop/mobile layout and browser logic should be checked on actual iOS and Android devices before publishing; those physical devices were not available during the build.



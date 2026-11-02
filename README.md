# Chiron & Samantha — November website build

The website is published from the root of the main branch at https://chironandsamantha.com.au/.
The custom domain is preserved in CNAME. The previous website remains available through Git history.

## Website files

Keep index.html, styles.css, app.js, photos.js, zip.js, img/, photos/, and thumbnails/ together.
All 163 original JPGs are included, with lightweight thumbnails and 24 gallery photos shown at a time.
Each photo has an individual download link and a selection checkbox.
The floating download bar bundles selected originals into a ZIP in the visitor's browser.

## Download all photos

The Download all button links to:
https://github.com/ChironAndSamantha/Wesbite/releases/download/party-photos/Chiron-and-Samantha-all-photos.zip

The GitHub Actions workflow .github/workflows/party-photo-archive.yml builds and verifies the full ZIP, then attaches it to the party-photos release whenever photos.js, build_archive.py, or photos/ changes on main.
It can also be run manually from GitHub Actions.
This avoids building the full 365 MB archive on a visitor's device.

To build the same archive locally, run python build_archive.py.
The ZIP is excluded from Git because it exceeds GitHub's normal file-size limit.
Do not commit downloads/*.zip or use GitHub's automatically generated source-code ZIP.

## Saving on devices

Use HTTPS for the native Save / Share option, which appears only on browsers supporting image-file sharing.
Individual JPG downloads and Open original remain available as fallbacks.
On iPhone, downloaded files may appear in Files rather than Photos.
Open the ZIP in Files to extract its images; Android and desktop users can open or extract the ZIP in their file manager.
Browser-generated selection ZIPs require device memory, so smaller selections are preferable on older phones.

## Preview and maintenance

Run python -m http.server 8080 from the build folder and visit http://localhost:8080.
The complete local source is also retained in NEW WEBSITE BUILD NOVEMBER in the original workspace.
The wedding countdown targets the start of 28 October 2028 in Sydney (UTC+11), not a ceremony time.
Invitations are announced for 2027.

JavaScript syntax, photo copies, thumbnail integrity, gallery selection behaviour, ZIP contents, and extraction were checked.
Physical iOS and Android testing remains unverified.

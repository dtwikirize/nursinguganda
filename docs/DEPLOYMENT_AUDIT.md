# Nursing Uganda Deployment Audit

Generated: 2026-05-06

## Current Public Entry

The active web app entry is `index.html`. It loads:

- `assets/css/app.css`
- `assets/js/app.js`
- `assets/data/curriculum.json`
- `assets/data/topic-image-matches.json`
- `assets/images/optimized/nursing-uganda-optimized-image-manifest.json`

The app is a hash-routed static web app. Main routes are `#/notes`, `#/courses`, and `#/resources`.

## Keep For Deployment

- `index.html`
- `manifest.webmanifest`
- `service-worker.js`
- `robots.txt`
- `sitemap.xml`
- `assets/`
- `DEPLOYMENT.md`

## Legacy HTML Folders

These folders contain older static HTML pages from the previous site structure. They are not required for the active SPA routes, but they may still be useful as source/reference material until the conversion is fully accepted.

| Folder | Files | HTML files | Recommendation |
| --- | ---: | ---: | --- |
| `blog/` | 1 | 1 | Archive after final content review |
| `courses/` | 32 | 32 | Archive after confirming all course content exists in `curriculum.json` |
| `disclaimer/` | 1 | 1 | Replace with SPA policy route or remove before launch |
| `licensing/` | 1 | 1 | Archive after resource page review |
| `login/` | 1 | 1 | Remove before launch unless login is being rebuilt |
| `notes/` | 1 | 1 | Archive after SPA notes route is approved |
| `past-papers/` | 1 | 1 | Archive after resource page review |
| `privacy-policy/` | 1 | 1 | Replace with SPA policy route or keep as standalone legal page |
| `programmes/` | 87 | 85 | Archive after verifying all programme pages are imported |
| `quizzes/` | 1 | 1 | Archive after quiz hub review |
| `resources/` | 1 | 1 | Archive after SPA resources route is approved |
| `schools/` | 1 | 1 | Archive after schools directory review |
| `terms/` | 1 | 1 | Replace with SPA policy route or keep as standalone legal page |

## Recommended Cleanup Plan

1. Deploy the SPA with legacy folders still present for one preview build.
2. Compare the preview routes against the old folders for missing content.
3. Move legacy folders into an archive branch or zip outside the deployment root.
4. Keep legal pages either as SPA routes or standalone static files.
5. Regenerate `sitemap.xml` for the final route plan.

## Do Not Remove Yet

Do not delete `programmes/`, `courses/`, or `assets/` until the imported curriculum and images are fully reviewed. They still serve as a useful safety net while the app is being curated.

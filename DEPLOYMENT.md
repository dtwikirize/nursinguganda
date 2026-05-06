# Hostinger Deployment Notes

This is a static-first site for `nursinguganda.com`.

## Upload

Upload the contents of this folder to Hostinger `public_html`.

Important files and folders:

- `index.html`
- `assets/css/styles.css`
- `assets/js/main.js`
- `assets/images/`
- `programmes/`
- `courses/`
- `notes/`
- `past-papers/`
- `quizzes/`
- `licensing/`
- `schools/`
- `blog/`
- `contact/`
- `login/`
- `privacy-policy/`
- `terms/`
- `disclaimer/`

## URL Structure

Pages use folder-based `index.html` files, for example:

- `/programmes/diploma-nursing/`
- `/programmes/diploma-nursing/year-1/`
- `/programmes/diploma-nursing/year-1/semester-1/`
- `/programmes/diploma-nursing/year-1/semester-1/anatomy-physiology/`
- `/programmes/diploma-nursing/year-1/semester-1/anatomy-physiology/introduction-to-anatomy/`

## Where to Expand

- Add more programmes under `programmes/`.
- Add more course units under the correct semester folder.
- Add more topics as folders under each course unit.
- Add quiz data inside `assets/js/main.js` for version 1.
- Move quiz data to a backend/database later when student accounts are added.

## Medical Verification

Before public launch, mark every medical page with one of:

- `draft`
- `needs_verification`
- `verified`
- `needs_clinical_review`

Use official sources and clinical review for high-risk medical content.

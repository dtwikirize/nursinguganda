# Nursing Uganda (`nursinguganda.com`) — Live Project Status

_Last Updated: 2026-11-24 02:51 EAT_

## ✅ Completed & Committed Locally on `main` (Pending `git push origin main`)
- **Udemy-Style Architecture & Catalog**: 7 Programmes, 95 Course Units, 819 Canonical Lessons (`assets/data/catalog.json` + modular per-course JSONs).
- **Authoritative References**: 24 verified clinical/academic sources attached to topics and units (`WHO`, `Uganda MoH Clinical Guidelines 2023`, `UNMEB`, `UNMC`, `OpenStax`, `Open RN`).
- **Free Referenced Study eBooks & Clinical Hubs**: 8 multi-chapter Free eBooks (`/ebooks`), 6 UNMEB Mock Exams (`/mock-exams`), Medical Dictionary (`/dictionary`), Instrument Atlas (`/instruments`), Clinical Tools (`/clinical-tools`), and Free Major Topic Quizzes (`/quizzes`).
- **Official BrandKit**: Vector stacked logo (`Nursing UGANDA` & `Nursing UG`), Poppins + Inter + Merriweather typography, `/brand-kit` hub.
- **Hostinger MySQL + PayPal Backend**: Node.js Express API (`api/express-api.js`) connected to Hostinger MySQL (`u443666287_nursingug`) and PayPal Checkout verification.
- **Hostinger Email Hosting**: Active mailboxes (`no-reply@nursinguganda.com`, `support@nursinguganda.com`, `editorial@nursinguganda.com`) with verified `MX`, `SPF`, `DKIM`, and `DMARC`.
- **Google OAuth 2.0 Sign-In**: Project `Nursing Uganda` published to **Production** (`In production`) with `GOOGLE_CLIENT_ID` configured on Hostinger.
- **Security & Cache Hardening**: Per-endpoint rate limits, 5-attempt / 15-minute brute-force lockout, HMAC session cookies (`HttpOnly`, `SameSite=Lax`, `Secure`), CSRF Origin checks, CSP/HSTS/XFO headers, `no-store` HTML cache rules (`server.js`), 6-digit email OTP verification, and security alert emails.
- **Branded Email Templates & 50/Day Weekly Digest Scheduler**: Custom HTML emails (`api/email-templates.js`) with daily `50` digest / `90` total email safety ceiling under Hostinger's `100/day` limit (`node-cron`), plus automatic Quiz Result & Certificate emails.
- **Owner-Only Admin Panel (`/admin`)**: Strictly locked to `twikirizederick@gmail.com`; includes visit analytics, top pages, PayPal orders/revenue, subscriber management, digest campaign sender, and security alerts feed.
- **Clean Distraction-Free Login Page (`/login`)**: Header & Footer removed (`src/App.jsx`, `src/pages/LoginPage.jsx`).
- **Simplified Interactive Explore Mega Menu & Mobile Drawer (`Navbar.jsx`)**: Free Study & Clinical Hubs update the right panel dynamically on hover/focus with clean one-line topic/unit links (no ratings or promo clutter).
- **Custom Medical Artwork & Page-by-Page Study Visuals (`TopicVisuals.jsx` & `assets/data/topic-visuals-manifest.json`)**:
  - 9 AI-generated anatomical plates + 9 crisp vector-to-WebP clinical plates (`assets/images/medical-illustrations/`).
  - Colored page-by-page numbered note cards, shapes, diamond bullets, Clinical Pearls, Red Flag alerts, dynamic 5-step workflows, and clinical reference tables across all `819` unique topics (`1,864` course lessons & `48` eBook chapters); purged `2,382` corrupt/low-res legacy images.
- **Upgraded & Expanded Medical Instrument Atlas (`146` Instruments — `medical-instruments.json` & `InstrumentsPage.jsx`)**:
  - Enhanced all `108` clean studio WebP plates, removed duplicates/misspellings, and generated `38` new custom 800x600 clinical vector WebP plates (Airway, Midwifery, IV/Medication, Diagnostic, Theatre) with specific `use`, `preparation`, `sterilization`, `safety`, and 4 OSCE exam points per instrument.
- **Free Major Topic Quizzes (`/quizzes` — `270` Questions across 10 Topics)**:
  - `27` questions per major topic (~70% Single-Choice, ~15% Multi-Choice, ~15% True/False), mandatory Sign-In gate, instant breakdowns & clinical rationales, MySQL tracking (`quiz_attempts`), and automatic result email delivery (`POST /api/quiz-submit`).
- **Course Session Quizzes (5 Qs), Final Evaluations (30 Qs) & Certificates (`CoursePlayerPage.jsx` & `CertificateCard.jsx`)**:
  - Per-session 5-question mixed checkpoint quizzes in every lesson + 30-question Final Course Evaluation with **60% passmark**, **maximum 4 attempts**, printable Certificate of Study Completion, and automatic certificate emails (`POST /api/course-eval`).
- **Learner Dashboard Badges & Certificates (`/my-learning` — `MyLearningPage.jsx`)**:
  - `"Badges & Certificates"` sidebar tab showing 6 milestone achievement badges, earned printable Certificates of Completion with verification codes, and full quiz/evaluation attempt history.
- **Broadened Terms of Service, Privacy Policy, Legal & Medical Disclaimers (`TrustPage.jsx` & `Footer.jsx`)**:
  - Comprehensive Terms of Service, Uganda Data Protection & Privacy Act (2019) aligned Privacy & Cookies Policy, Editorial & National Clinical Guideline Hierarchy Policy, UNMEB/UNMC/MoH Non-Affiliation Notice, Acceptable Use/Refund Policy, and Certificate Non-Licensure Disclaimers.

## ⏳ Operational / Manual Production Items
- **Push local `main` commits to GitHub (`git push origin main`)** once network access to `github.com:443` is restored so Hostinger auto-deploys the latest build (`140.82.121.4:443` TCP connection timed out during automated push).
- Switch `PAYPAL_MODE` from `sandbox` to `live` in Hostinger Environment Variables when ready to accept live billing.
- Optional: Upload `nu-variant-3-192.png` App Logo manually on Google Cloud Console Branding page (`https://console.cloud.google.com/auth/branding`).

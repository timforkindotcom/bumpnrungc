# Bump N Run Golf Club

Mobile golf repair marketing site with a surprise Unity hole on the homepage.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/studio](http://localhost:3000/studio) for the content studio.

Public pages (same look as the scorecard tabs):

- [/services](http://localhost:3000/services) — golf club repair
- [/location](http://localhost:3000/location)
- [/about](http://localhost:3000/about)
- [/contact](http://localhost:3000/contact)
- [/merch](http://localhost:3000/merch)
- [/privacy](http://localhost:3000/privacy)

## Unity WebGL

The homepage loads Unity from `public/unity/`.

1. Open the Unity project **Bump N Run Game**
2. Menu: **Bump N Run → Build WebGL For Site**
3. Wait for the build (writes into this repo’s `public/unity/`)
4. Refresh the Next site

Player Settings: Unity splash screen / logo should stay **off** so visitors only see the site loader.

The Unity `DoNotShip` debug folder is gitignored. Do not upload it.

## Features

- Unity WebGL par-3 hole (custom loading copy — no “Made with Unity” splash)
- Scorecard popups on the home page, plus real URLs for Google
- Masters-green chrome + Spirits / Spaghetti Western (Typekit)
- Sanity Studio CMS for copy (optional — defaults in `src/lib/content.ts`)
- Contact form → Google Sheet + email (Google Apps Script)
- Sitemap, robots.txt, share image, and local-business structured data

## Page copy

Edit marketing text in:

- `src/lib/content.ts` (defaults used when Sanity isn’t configured), or
- Sanity Studio at `/studio`

Put your real **phone**, **email**, and social links in `src/lib/content.ts` before launch (`contact.phone`, `contact.email`, `contact.instagram`, `contact.facebook`).

## Contact form (Google Sheet + email)

1. Create a Google Sheet.
2. **Extensions → Apps Script** — paste [`docs/google-contact-apps-script.js`](docs/google-contact-apps-script.js).
3. Set `NOTIFY_EMAIL` (and optional `SECRET`) at the top of the script.
4. **Deploy → New deployment → Web app**  
   - Execute as: **Me**  
   - Who has access: **Anyone**
5. Copy the web app URL into `.env.local` (and later into Vercel):

```bash
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec
# GOOGLE_SCRIPT_SECRET=same-as-script-if-set
```

6. Restart `npm run dev` (or redeploy on Vercel with the same env vars).

Without `GOOGLE_SCRIPT_URL`, submissions are logged to the server console in development. On the live site they will look successful but **will not be saved**.

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Live domain: `https://bumpnrungc.com` (no trailing slash) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 id, like `G-XXXXXXXXXX` (production only) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID for CMS (optional) |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (default: `production`) |
| `GOOGLE_SCRIPT_URL` | Apps Script web app URL for contact leads |
| `GOOGLE_SCRIPT_SECRET` | Optional shared secret with the script |

## Deploy

1. Push this repo to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Add the environment variables above.
4. Point your domain at Vercel (they show the exact DNS records).
5. In Adobe Fonts, add the live domain to kit `nma7fmi`.
6. In Google Search Console, add `bumpnrungc.com` and submit `https://bumpnrungc.com/sitemap.xml`.

Include `public/unity` in the deploy (do not gitignore the WebGL build).

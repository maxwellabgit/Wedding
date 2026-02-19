# Rasmi & Max — Wedding Website

A simple, elegant wedding website for December 19th, 2027 in Fort Lauderdale, Florida.

## Customize

1. **Names** — Update names in `index.html` if needed.
2. **Venue** — Add your venue name and address in the Event Details section.
3. **Our Story** — Edit the intro text to tell your story.
4. **Photos** — Add images to `public/` when ready.
5. **RSVP (Supabase)** — Edit `config.js` with your Supabase URL and anon key. See comments in that file for the SQL to create the `rsvps` table.

## Run locally

Open `index.html` in a browser, or use a simple server:

```bash
cd wedding
npx serve .
```

Then visit http://localhost:3000 (or the port shown).

## Deploy

Upload the `wedding` folder to any static host (Netlify, Vercel, GitHub Pages, etc.) or serve the files directly.

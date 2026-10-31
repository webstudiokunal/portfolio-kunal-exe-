# Kunal.exe OS — personal portfolio (kunalexe.in)

Plain HTML/CSS/JS. No install, no build. Open `index.html` to preview.

```
index.html              page structure
css/styles.css          looks (colors, water text, buttons)
js/app.js               apps, windows, search, themes
js/water.js             water ripple background
content/owner-profile.js   ALL your content (edit this one!)
assets/kunal.jpg        your photo that drifts in the background
robots.txt, sitemap.xml for Google
COPILOT_GUIDE.md        copy-paste prompts for Copilot
```

## Put it live on kunalexe.in (free, Cloudflare Pages)
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Upload assets** (direct upload).
2. Name the project `kunalexe`, drag in **this whole folder** (so `index.html` is at the top level), click **Deploy**.
3. Open the project → **Custom domains** → **Set up a custom domain** → type `kunalexe.in` → confirm.
   (Your domain is already on Cloudflare, so DNS is added for you.) Also add `www.kunalexe.in` if you want.
4. Wait a few minutes, open https://kunalexe.in.
Do NOT delete the email records in DNS (MX records) — your me@kunalexe.in mail depends on them.

To update later: change files, then in Pages → your project → **Create new deployment** → upload the folder again.

## Honest-content rule
Only real projects, numbers and reviews. Everything unproven is labelled or left empty.

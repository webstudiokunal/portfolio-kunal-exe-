# How to edit this website with GitHub Copilot (no coding needed)

1. Open this folder in **VS Code**  (File → Open Folder).
2. Open **Copilot Chat** (the chat icon, or Ctrl+Alt+I). Pick **Agent** mode if you see it.
3. Copy one of the prompts below, change the part in [brackets], and send it.
4. Copilot edits `content/owner-profile.js`. Click **Keep** to accept.
5. Open `index.html` in your browser (or use the Live Server extension) and check.
6. Upload the folder again to Cloudflare Pages (see README.md).

Copilot already reads the rules in `.github/copilot-instructions.md`, so you do not have to repeat them.

---

## PROMPTS

### Add a project
Add a new project to `projects` in content/owner-profile.js.
Name: [Glow Salon Website]. Client: [Glow Salon]. Category: [Business Website]. Dates: [Oct 2026].
Problem: [they had no website]. What I built: [5-page mobile-first site with WhatsApp booking button].
Outcome: [live site, bookings come on WhatsApp]. Outcome status: [client-reported].
Live link: [https://...]. Tech: [HTML, CSS, JavaScript]. Featured: [true].
Do not invent anything I did not write.

### Add a demo project (if you have no client yet)
Add a demo project to `projects`: "[Sample Salon Website]", category "[Business Website]",
and clearly say it is a demo in the client field ("Demo project") and outcomeStatus "illustrative". Link: [https://...].

### Add or change a service
Add a service to `services` in content/owner-profile.js. Name: [E-commerce Store].
One-line description: [a simple online shop with cart and WhatsApp orders].
Three bullet points: [..., ..., ...].

### Add a result
Add to `clientCases`: client [Glow Salon], metric [2x], metricLabel [WhatsApp enquiries in 30 days],
status [client-reported], source [message from the owner on 12 Oct 2026], challenge [..], delivered [..], url [https://...].

### Add proof (testimonial)
Add to `testimonials`: name [..], role [..], quote ["exact words the client wrote"],
youtubeId [only the 11-letter ID, or leave empty], approved true (the client agreed to show it).

### Add a journey milestone
Add to `journey`: year [2025], title [My first client website], text [two simple sentences].

### Add a social link
Add to `socials`: name [Instagram], handle [@yourhandle], url [https://instagram.com/yourhandle], purpose [behind the scenes], status active.

### Add an article (AI Field Notes)
Add to `articles`: title [How much does a business website cost in India?], summary [one or two sentences],
date [2026-11-01], url [https://kunalexe.in/blog/website-cost.html or leave empty].

### Add a booking link
Set `conversion.bookingUrl` to [https://cal.com/yourname]. The Calendar app will then show a "Book a call" button.

### Change the Founder note
Rewrite the `founder` section using my text below, keeping the same field names: [paste your text].

### Change a design thing (only when you want to change how it looks)
In css/styles.css, [make the water ripples stronger / change the photo size / slow the KUNAL.EXE text].
You can also edit js/water.js (ripples) — constants at the top.

---

## What each app means (simple words)
- **Projects**: your best finished websites. This is the most important app.
- **Services**: what you sell and what the client gets.
- **Results**: real numbers after your work (e.g. "enquiries doubled"). Leave empty until you have real ones.
- **Systems**: your 5 steps of working. Written already; change the words in js/app.js (RENDER.systems) if you like.
- **Proof**: reviews or videos from happy clients. Only with their permission.
- **Journey**: your story.
- **Socials**: where people can find you.
- **Founder.txt**: your introduction note.
- **KunalNet**: a mini browser. It lists your live project websites automatically from Projects.
- **Case Files**: the same projects shown like folders and files. Automatic from Projects.
- **AI Field Notes**: your blog / articles. Optional. Empty is fine.
- **Contact**: form that opens WhatsApp or email with the message ready.

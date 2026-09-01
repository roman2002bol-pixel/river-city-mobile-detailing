# River City Mobile Detailing – Website

A complete, static (HTML/CSS/JS only – no build step, no dependencies) 15-page
website, built mobile-first for a mobile detailing business serving the
Richmond, VA metro area.

## 1. Preview it right now

Just double-click `index.html` (or any other page) – it opens directly in
your browser, no server needed. All internal links and images work relative
to the file structure, so keep the folders together as-is.

## 2. What's in here

```
index.html            Home
about.html
reviews.html
contact.html          Booking / quote form
services/
  full-detail.html
  standard-detail.html
  interior-deep-clean.html
  ceramic-coating.html
areas/                One page per service-area city (unique copy on each,
  richmond.html        for local SEO – not duplicated text)
  chesterfield.html
  midlothian.html
  colonial-heights.html
  chester.html
  glen-allen.html
  short-pump.html
css/style.css          All design/styling – one file, no framework
js/main.js             Mobile nav, image placeholders, form handling
images/README.txt      Exact filenames the site expects – drop your photos in
```

## 3. Before you launch – placeholders to replace

**Phone number & email** – every page currently uses a placeholder number
`(804) 555-0142` (as text, `tel:+18045550142`, and `sms:+18045550142`) and
`info@rivercitymobiledetailing.com`. Once you have a real business number,
replace it everywhere in one shot:

```powershell
# Run from the project folder in PowerShell – updates every file at once.
Get-ChildItem -Recurse -Include *.html,*.js | ForEach-Object {
  (Get-Content $_.FullName -Raw) `
    -replace '\(804\) 555-0142', '(YOUR) NEW-NUMBER' `
    -replace '\+18045550142', '+1YOURNEWNUMBER' `
    -replace 'info@rivercitymobiledetailing\.com', 'your-real-email@example.com' |
    Set-Content $_.FullName -NoNewline
}
```
Use the same digits-only format (`+1XXXXXXXXXX`) for the `tel:`/`sms:` version
so click-to-call and click-to-text work correctly.

**Images** – see `images/README.txt` for the exact filenames. Drop matching
files into `/images` and every placeholder box disappears automatically.
The homepage hero also expects a background photo at `images/hero-bg.png`
(a wide, moody shot works best – see the CSS notes in section 6).

**Reviews** (`reviews.html` and the homepage) – the review cards are marked
`[Add a real Google review here]` on purpose. Don't invent testimonials –
copy your actual current Google reviews in, word for word, or embed Google's
own review widget. There's also a "Leave a Review" button that needs your
Google Business Profile Place ID (instructions are in an HTML comment right
above it in `reviews.html`).

**Live scheduling (Setmore)** – `contact.html` has a "Choose a Package &
Book a Time" button that opens your Setmore booking page, so customers pick
their own package and an open time slot. To activate it:
1. Sign up free at [setmore.com](https://setmore.com).
2. Under Services, add your packages (Standard Detail, Interior Only Deep
   Clean, Full Detail, Ceramic Coating – Two Year and Three Year – plus any
   new offerings you want) with your own real durations, prices, and
   descriptions.
3. Set your working hours/staff.
4. Copy your booking page link (looks like
   `https://your-business-name.setmore.com`) and paste it into the button's
   `href` in `contact.html` (search for `YOUR-BUSINESS-NAME`).
5. Optional – for an in-page popup instead of opening a new tab: in the
   Setmore dashboard go to Booking Page → Add to Website, copy the embed
   snippet it generates, and send it over to swap in.

**Booking form** (`contact.html`) – the form currently has no backend, so a
submission opens a pre-filled email as a fallback (nothing is ever lost, but
it's not fully automatic). To wire it up properly, pick one:
- **Netlify Forms** (easiest, free): host the site on Netlify, add
  `data-netlify="true"` and a hidden `form-name` input to the `<form>` tag –
  submissions land in your Netlify dashboard automatically.
- **Formspree** or similar: set the form's `action` to your Formspree
  endpoint and set `data-endpoint-ready="true"` on the `<form>` tag.
- Your own backend: same as above, point `action` at your endpoint.

**About page** – the story/history text is intentionally generic. Swap in
your real founding story, certifications, and specifics – that's what
actually builds trust, more than any stock copy can.

**Logo** – the header uses a clean text-based "RC / River City / Mobile
Detailing" wordmark, so the site looks finished with zero extra assets. If
you get a real logo file later, replace the `<span class="logo-mark">RC</span>`
+ `<span class="logo-text">…</span>` block (appears identically near the top
of every page) with an `<img src="images/logo.png" alt="River City Mobile
Detailing">`. See section 7 for how to get a logo made.

## 4. Deploying

Any static host works since there's no server-side code:
- **Netlify** – drag the whole folder onto app.netlify.com/drop (also gets
  you free form handling, see above).
- **GitHub Pages / Cloudflare Pages** – push the folder to a repo, enable
  Pages.
- **Traditional hosting (GoDaddy, cPanel, etc.)** – upload the folder via
  FTP/File Manager as-is.

Once you have a domain, update the `<link rel="canonical">` tags and the
`AutoDetailing` JSON-LD block in `index.html` from the placeholder
`rivercitymobiledetailing.com` to your real domain.

## 5. SEO already built in

- Unique `<title>` and meta description per page, targeting the keyword set
  from the brief ("mobile detailing Richmond VA", "ceramic coating
  Richmond", "interior car detailing near me", etc.) naturally in H1s and
  opening paragraphs – not stuffed.
- Each of the 7 city pages has genuinely different copy (not one template
  swapped by name), which is what Google expects from real "service area"
  pages.
- `AutoDetailing` structured data (JSON-LD) on the homepage for local search.
- Fast by default: no JS frameworks, no icon-font/CDN requests, no heavy
  animation – just one CSS file and one small JS file.

## 6. Design notes (why it doesn't look like a template)

The visual system leans on the brand name itself: Richmond, VA is nicknamed
"River City" after the James River running through it. Instead of the
generic water-droplet/bubble graphics most detailing sites use, the site's
background texture and section dividers use a subtle topographic
contour-line motif tied to that idea, paired with a deep navy + teal palette
(`css/style.css`, top `:root` block – change the `--accent` and `--ink`
variables there to retheme the whole site in one place) and a sticky mobile
call/text/book bar that's genuinely functional, not just decorative.

The homepage hero is a full-bleed photo background (`.hero` in
`css/style.css` – set via `background-image` alongside the contour texture,
with a dark gradient overlaid for text contrast) rather than a stock
before/after graphic. Drop your photo in as `images/hero-bg.png`; until then
it just shows the plain navy/contour background, nothing breaks.

## 7. Getting a real logo made

The current header/footer logo is a clean text wordmark ("RC" mark +
"River City / Mobile Detailing"), so the site looks finished with zero
extra assets – there's no rush to replace it. When you're ready for a real
mark, here's a prompt written for the brand's actual palette and concept,
ready to paste into an AI image tool (Midjourney, DALL·E, Ideogram, etc.):

> Minimalist flat vector logo mark for "River City Mobile Detailing," a
> premium mobile car detailing service. Combine a subtle car silhouette or
> shine/sparkle motif with a single flowing river/wave line underneath it,
> referencing the James River running through Richmond, Virginia. Clean
> geometric shapes, two-color only: deep navy (#0c1a28) and teal (#1fb6ad)
> on a white background. No gradients, no photographic detail, no text in
> the mark itself. Must read clearly as a small icon (favicon-size) as well
> as large. Style: modern, trustworthy, understated – not a cartoon car,
> not a generic droplet clip-art icon.

A few things that reliably improve logo-generation results with any tool:
- Ask for several distinct concepts/variations, not one "final" image.
- Explicitly ban gradients and drop shadows – they don't scale down well.
- Request it on a plain white or transparent background, mark only (no
  mockup, no business card, no environment).
- Once you like a direction, ask the tool to "simplify further" or "reduce
  to flat shapes" – first outputs from most AI image tools are usually
  more detailed than a logo should be.

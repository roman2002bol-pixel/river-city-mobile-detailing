---
name: web-dev-agent
description: |
  Playbook and accumulated lessons for building/maintaining static (no-build-step)
  HTML/CSS/JS marketing websites for small local-service businesses (mobile
  detailing and similar), including SEO/schema, GitHub Pages deployment, booking
  platform integration, and browser-automation testing gotchas. Trigger whenever
  building a new site in this folder, adding pages/features to an existing one,
  doing an SEO or QA pass, wiring up booking/forms, or debugging nav/CSS/JS bugs.
---

# Web Dev Agent — Small-Business Marketing Site Playbook

You are acting as an ongoing web-development agent for Roman's small-business
marketing sites, all living as sibling folders under this `Project1` directory
(currently: `fall-line-auto-detailing` / River City Mobile Detailing in
Richmond, VA, and `nexus-mobile-detailing-pontevedra` / NEXUS Mobile Detailing
of Ponte Vedra, FL — same owner, two separate local markets, more may be
added later). Every lesson below was learned the hard way while building
these two — apply it by default on the next one instead of re-discovering it.

## Site architecture conventions

- Static HTML/CSS/JS only. No build step, no framework, no bundler.
- One `css/style.css`, one `js/main.js`, shared across all pages.
- Folder layout: `index.html`, `about.html`, `contact.html`, `reviews.html`,
  `services/*.html` (one per package), `areas/*.html` (one per service area —
  see "thin-page" rule below), `images/`, `llms.txt`, `README.md`.
- **Cache-busting is mandatory, from the first commit.** Every `<link
  rel="stylesheet">` and `<script src="...main.js">` tag gets a `?v=N` query
  param. Bump `N` on *every* edit to that file, on *every* page that includes
  it (grep for the old value across the whole repo — don't rely on memory of
  which pages you touched). Real bug hit twice: once forgot to bump CSS after
  a background-image change (user saw "nothing changed"), once discovered
  `main.js` had **never** had a version param at all since the project started.

## SEO / structured data checklist

**The `searchfit-seo` plugin is installed — see [[seo-toolkit]] for the full
mapping of which of its skills to use for audits, schema generation, keyword
research, content strategy, technical SEO, internal linking, and AI-visibility
tracking.** Use it instead of doing these tasks fully by hand; the rules below
are what those tools don't know about this project and must still be checked
by hand afterward.

- Unique `<title>` + meta description per page, keyword worked naturally into
  the H1 and opening paragraph — never stuffed.
- JSON-LD on every page that warrants it: `AutoDetailing` (or the relevant
  `LocalBusiness` subtype) + `Service` + `FAQPage` + `BreadcrumbList`.
- **FAQ schema text must exactly match the visible `<details>`/FAQ text on the
  page.** Google's guidelines require this literally — never let them drift
  apart when editing one and forgetting the other.
- `areaServed` should use structured `City` entities (with
  `containedInPlace`) where possible, not just bare strings.
- Ship an `llms.txt` at the project root (llmstxt.org standard) summarizing
  services w/ prices, the booking link, service area, and company pages — this
  is for AI assistants/agents discovering the business, not just search
  crawlers.

## Multi-site portfolio: duplication is the real risk, not shared structure

When this owner spins up a new site for the same kind of business in a new
city (e.g. Richmond → Ponte Vedra), it's tempting to clone the old site
wholesale. Two things matter here, confirmed against Google's actual spam
guidance and against sourced video research:

- **Shared HTML/CSS structure and shared stock photography are NOT a
  penalty risk.** Identical page layout/skeleton across sibling sites is
  fine — it's just a template.
- **Near-duplicate prose IS a real risk.** After cloning NEXUS from Richmond,
  a `difflib`-based sentence comparison found ~86 near-identical sentences
  across the two sites. Fix: systematically rewrite genuine marketing prose
  per page on the new site. It's fine to leave short factual labels and
  universal FAQ *questions* (e.g. "How much does mobile detailing cost?")
  unchanged — only the answer/prose text needs to be genuinely distinct.
- **Don't template out area/location pages ahead of real content.** Google's
  spam updates specifically target sites publishing many near-identical
  templated location pages. Only ship a dedicated `areas/<city>.html` once you
  have something real and specific to say about that place (real
  neighborhoods, a location-specific FAQ, actual coverage) — not by
  copy-pasting an existing area page and swapping the city name. A business
  can (and should) still say in prose that it serves a wider region without
  giving every town in that region its own thin page.

## Nav dropdown: hover-to-open + click-to-toggle-closed (real bug, fixed twice)

The desktop "Services ▾" dropdown needs to open on hover **and** let a click
on the already-open trigger close it again. Two naive approaches both break:

- Pure CSS `:hover` — can't be closed by a click at all.
- JS where `mouseenter`/`mouseleave` and `click` all just toggle the same
  `is-open` class — breaks because clicking (including via automation, but
  also some real trackpads/mice) fires `mouseenter` immediately
  before/alongside the `click` event. Net effect: the click appears to do
  nothing, because the just-fired mouseenter silently reopens what the click
  just closed.

**Correct pattern — a `lockedClosed` flag per nav-group:**

```js
document.querySelectorAll(".nav-group").forEach(function (group) {
  var label = group.querySelector(".nav-group-label");
  var lockedClosed = false;

  label.addEventListener("click", function () {
    if (window.innerWidth >= 960) {
      var isOpen = group.classList.contains("is-open");
      group.classList.toggle("is-open", !isOpen);
      lockedClosed = isOpen; // just closed it -> lock; just opened it -> unlock
    } else {
      group.classList.toggle("is-open");
    }
  });
  group.addEventListener("mouseenter", function () {
    if (window.innerWidth >= 960 && !lockedClosed) group.classList.add("is-open");
  });
  group.addEventListener("mouseleave", function () {
    if (window.innerWidth >= 960) {
      group.classList.remove("is-open");
      lockedClosed = false;
    }
  });
});
```

Copy this pattern verbatim for any future site's dropdown nav. Test it with
explicit separate hover → click → click steps and a JS class-list check
between each (see testing section below) — a bundled/simulated click can mask
this exact bug.

## CSS stacking-context gotchas (both confirmed via real hit-testing, not guesses)

- **z-index trap:** if a parent (e.g. `.site-header`) establishes its own
  stacking context (`position: sticky` + a `z-index`), a child's `z-index`
  is only compared *within* that context — it can't out-rank a sibling
  element that lives in a different, higher stacking context no matter how
  high you set it. Fix by adjusting the *other* element's z-index (the
  overlay, in this case), not by chasing ever-higher numbers on the trapped
  child.
- **Hover dead-zone:** any `margin`/gap between a hover trigger and the
  element it reveals breaks `:hover` continuity — the cursor crosses a gap
  with no listener and the dropdown closes before it reaches the sub-menu.
  Remove the margin (use padding on the bounding box instead), or don't rely
  on pure `:hover` for anything with a gap.

## Design quality: avoiding generic "AI slop"

Filtered from creator research on why most AI-built sites look the same
(the raw source material was course-marketing content for unrelated
platforms/tools — Base44 app-cloning, Higgsfield video generation — none of
which applies to our static HTML/CSS/JS stack; what follows is only the
part that actually transfers):

- **Actively avoid the default AI visual tells**: the indigo-to-violet
  gradient, exactly-three feature cards, heavy rounded/frosted-glass card
  styling, and generic AI-sounding headlines ("Unlock the power of...",
  "Seamlessly..."). Richmond and NEXUS already avoid this by using a
  deliberate 2-color brand palette tied to the actual business (not a
  default gradient) — keep doing that for any future site.
- **Before calling a design done, benchmark it against 1-2 real,
  well-regarded reference sites** (not necessarily a direct competitor —
  just something with a genuinely high design bar) and explicitly critique
  the draft against them, section by section. Don't just eyeball it against
  nothing.
- **Fonts matter more than they get credit for.** Don't ship on bare
  browser-default system fonts if a distinctive, properly-licensed
  (check commercial-use terms) font pairing fits the brand better.
- **Copywriting**: one clear point and one call-to-action per
  section/screen — don't stack competing CTAs. Lead with the customer's
  actual friction/pain point before the feature list, not after.
- **Run a "does this sound AI-written" pass on finished copy** — watch for
  em-dash-heavy headlines, "not just X, but Y" constructions, and generic
  superlatives. This is a different check than the cross-site-duplication
  diff above (that's about *matching* another page; this is about
  sounding human at all) — do both, not one instead of the other.

## Image sourcing

- Pexels CDN pattern for free/commercial-use stock photos:
  `images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w={N}&q={N}`
- When reusing the same stock photos across sibling sites in different
  cities, check what's actually *in frame* before approving — 3 photos got
  swapped out during QA on this project for a foreign license plate,
  Cyrillic signage, and a competitor-branded shirt, any of which would have
  been a real red flag to a local customer or Google.
- Python PIL/Pillow is available locally for resize/format/compression
  (e.g. converting a user-supplied PNG to a quality-compressed JPEG to hit a
  target file size for a hero background).

## Booking platform integration (Setmore, or similar third-party booking SaaS)

- **Never guess a subdomain.** These are first-come-first-served, not
  reserved by business name. A guessed `businessname.setmore.com` can
  coincidentally belong to a real, unrelated business in another state —
  confirmed twice on this project (once by luck it was the same client,
  once it very much was not). Verify with a direct fetch + look at the page
  content/schema before ever wiring a guessed URL into a live "Book Now"
  button. If unconfirmed, point the button at a safe in-page fallback
  (e.g. a same-page anchor to a quote form) until the client confirms the
  real account.
- Prices between the site and the booking dashboard are **not linked
  automatically** — keep them in sync manually, and re-verify the *entire*
  public booking page after any bulk edit. Scrolling UIs that reset to the
  top after each save are a real source of silent data-entry corruption —
  re-check every entry against the source of truth afterward, don't trust
  that each individual save succeeded correctly.

## Deployment workflow (GitHub Pages)

1. `gh repo create <name> --public --source=. --remote=origin` (or push to an
   existing repo).
2. Enable Pages: `gh api -X POST repos/<owner>/<repo>/pages -f
   source.branch=main -f source.path=/` (adjust for the actual default
   branch/path).
3. After every push, poll `gh api repos/<owner>/<repo>/pages/builds/latest`
   until `status` is `"built"` **and** the `commit` sha matches the commit you
   just pushed — don't stop polling on a stale `"built"` from a previous
   commit.
4. Always load the actual live URL afterward and check the real DOM (not just
   trust the API) before telling the client it's live.

## Browser-automation testing gotchas (verifying a site before/after deploy)

- To exercise a static site's real JS behavior locally, serve it with an
  actual local HTTP server (`python -m http.server <port>`) via a
  `.claude/launch.json` dev-server entry + `preview_start` — opening the file
  directly (`file://…`) can render as a flattened static snapshot that
  doesn't execute scripts, which silently invalidates any interaction test.
- A `launch.json` dev-server process's working directory follows the
  **session's** cwd, not the folder the `launch.json` file itself lives in.
  If serving a project that isn't the session's current root, pass
  `--directory <absolute path>` explicitly in `runtimeArgs`, and double-check
  `document.title`/`window.location.href` after starting the server to
  confirm it's actually serving the site you think it is.
- Screenshots can return a stale/cached frame when the pane isn't actively
  composited (e.g. a background tab). Prefer `get_page_text` /
  `javascript_exec` (reads the live DOM) as the source of truth for text or
  state checks; use screenshots for visual/layout confirmation only.
- Coordinate-based clicking is unreliable across scroll resets, virtualized
  lists, and viewport-scaling mismatches (a ~1.246x screenshot-space vs
  `window.innerWidth` mismatch was observed in practice). Prefer clicking a
  `ref_N` from `find`/`read_page`, or a direct JS `element.click()` by
  text-content match, over blind coordinates when reliability matters more
  than speed.
- `computer.left_click()` implicitly fires a `mouseenter` immediately before
  the click itself — this breaks naive hover+click state-coupling logic (see
  the nav dropdown bug above). When testing hover-driven UI, do hover and
  click as **explicit, separate** tool calls with a JS state check in
  between — never trust a single bundled click to prove hover-then-click
  behavior.
- `form_input` (a direct value-setter) is far more reliable than simulated
  keystroke typing for filling in form fields, especially on third-party SaaS
  UIs you don't control (e.g. a booking dashboard).
- When a page has an ambiguous text match across multiple DOM locations
  (e.g. a staff name appearing in nav, a sidebar, and an actual selectable
  option), narrow with a structural filter
  (`matches.find(el => el.closest('.the-actual-container'))`) rather than
  picking the first match.

## Safety / business-integrity defaults (non-negotiable, apply without being asked)

- **Never fabricate customer reviews or testimonials.** Leave a clearly
  marked placeholder (e.g. `[Add a real Google review here]`) with a note for
  the client to paste in their actual reviews, or embed Google's own review
  widget.
- **Never wire a live "Book Now" / payment / contact link to an unverified
  real-world third-party account.** Confirm it actually belongs to this
  client first (see Setmore section above).
- **A `mailto:` fallback is not a real form submission.** It only opens the
  *visitor's own* mail client (which many people, especially webmail-only
  users, don't have configured) and still requires them to manually hit send
  again — it silently loses a meaningful fraction of leads. Recommend a free
  no-code form backend (Formspree, Netlify Forms) over building a custom
  backend for a static site; only reach for a real backend if the client
  specifically needs server-side logic beyond just receiving submissions.
- **Placeholder contact info must be flagged as placeholder before launch,
  explicitly.** A domain used in a placeholder email (e.g.
  `info@businessname.com`) may not be a domain the client actually owns yet —
  if a `mailto:` fallback is live and pointed at an unregistered domain, real
  customer inquiries vanish with no error and no trace. Always call this out
  by name (which field, what it currently is, what needs to replace it)
  rather than leaving it implicit in a README the client may not reread.

## External skill candidates found on GitHub (not installed — ask before adding)

Researched on request; none of these are installed yet. Worth considering
if a future site needs heavier design polish than our current manual
process gives:

- [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)
  (33.5k★) — the master curated list; links straight to official skills
  from Anthropic, Vercel, Google Labs, OpenAI, Figma, Cloudflare, and
  independent marketers, not just community ones. Two entries in it are
  directly relevant to us:
  - [coreyhaines31/marketingskills — ai-seo](https://github.com/coreyhaines31/marketingskills/tree/main/skills/ai-seo) —
    optimizing content for AI-generated answers; overlaps with
    [[seo-toolkit]]'s `ai-visibility` entry, worth comparing approaches.
  - Cloudflare's Core Web Vitals / web-perf skill — overlaps with
    `technical-seo` in [[seo-toolkit]].
  - (Anthropic's own `frontend-design`/`web-artifacts-builder` and
    OpenAI's `frontend-skill` are React/Tailwind-oriented — don't fit our
    no-build-step static stack directly, but worth knowing they exist.)
- [superdesigndev/superdesign-skill](https://github.com/superdesigndev/superdesign-skill)
  (493★) — anti-AI-slop design skill; forces writing a
  `design-system.md` (typography/colors/spacing/components) before
  building anything, stack-agnostic.
- [jiji262/claude-design-skill](https://github.com/jiji262/claude-design-skill)
  (186★) — explicit anti-slop rules matching the "Design quality" section
  above almost verbatim (bans aggressive gradients, emoji bullets,
  rounded-card-with-left-border, gradient-orb-as-AI-icon).
- Broader curated lists worth knowing about generally:
  [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code),
  [karanb192/awesome-claude-skills](https://github.com/karanb192/awesome-claude-skills).

## Checklist for a brand-new site build in this folder

1. Confirm business name, city/service area, and real phone/email — if told
   to use placeholders for now, use obviously-placeholder-looking values and
   track exactly what needs replacing before launch.
2. Scaffold pages: `index`, `about`, `contact`, `reviews`, `services/*.html`,
   `areas/*.html` (only for areas with real, specific content to say).
3. Write genuinely unique prose per page — if this is a sibling to an
   existing site in this folder, diff the prose against it (a quick
   `difflib`-based script works well) before calling content done.
4. Add JSON-LD (the relevant LocalBusiness subtype + `Service` +
   `FAQPage` + `BreadcrumbList`), matching visible page content exactly —
   use `/searchfit-seo:schema-markup` and then hand-check against
   [[seo-toolkit]]'s rules.
5. Add `llms.txt`.
6. Source/verify images; if reusing stock photos across sibling sites, check
   every one for anything that identifies the wrong location or a competitor.
7. Wire the nav (mobile accordion + desktop hover/click using the
   `lockedClosed` pattern above); test both breakpoints explicitly.
8. Set up booking (verify the real platform account before linking) and/or a
   no-code form backend for any contact form.
9. Add cache-busting `?v=1` params to every CSS/JS include from the start;
   remember to bump them on every future edit.
10. Deploy to GitHub Pages; poll build status by commit sha; verify live in
    a real browser, not just via the API.
11. Before calling it launch-ready, do one explicit pass listing every
    remaining placeholder (phone, email, domain, reviews, pricing) and flag
    each one to the client by name — don't assume they'll rereview the
    README.

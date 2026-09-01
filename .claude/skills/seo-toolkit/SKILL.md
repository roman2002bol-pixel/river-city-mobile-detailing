---
name: seo-toolkit
description: |
  Maps which installed SEO skill/agent (mainly the searchfit-seo plugin) to
  reach for at each stage of SEO work on River City Mobile Detailing and
  NEXUS Mobile Detailing — keyword research, content planning, on-page
  optimization, schema markup, technical audits, internal linking, AI/LLM
  visibility (GEO/AEO), and broken-link checks — plus the project-specific
  rules from the web-dev-agent skill that automated tools don't know about
  and must still be checked by hand afterward. Trigger for any SEO task on
  either site: audits, schema generation, content strategy, keyword
  clustering, technical SEO, AI-visibility tracking, internal linking.
---

# SEO Toolkit — which tool to reach for, and what to double-check after

The `searchfit-seo` plugin is installed and covers most SEO tasks better/
faster than doing them by hand. **Reach for the matching skill below instead
of hand-rolling the task** — but always run the "still check by hand"
follow-up, because these are generic tools that don't know this project's
specific hard requirements (see [[web-dev-agent]] for where those rules come
from).

## Which skill for which job

| Task | Skill to invoke | Notes |
|---|---|---|
| Plan a new page/topic before writing | `/searchfit-seo:create-topic` or `/searchfit-seo:content-strategy` | Do this before `create-content`, not after |
| Research/organize a keyword list | `/searchfit-seo:keyword-clustering` (or `keyword-cluster`) | Keep the two sites' keyword sets separate — see below |
| Outline a specific article/page before writing | `/searchfit-seo:content-brief` | Feeds into `create-content` |
| Write new SEO content | `/searchfit-seo:create-content` | Still needs a human pass for the client's actual voice/facts |
| Generate JSON-LD / structured data | `/searchfit-seo:schema-markup` (or `generate-schema`) | **Always** verify FAQ schema text matches the visible `<details>` content afterward — this project's hard rule, tools don't enforce it |
| Optimize one existing page for a target keyword | `/searchfit-seo:on-page-seo` | |
| Full site/page SEO audit | `/searchfit-seo:seo-audit` (deep) or `/searchfit-seo:seo-check` (quick, single file) | Good recurring task — see below |
| Core Web Vitals / crawlability / robots.txt / sitemap | `/searchfit-seo:technical-seo` | |
| Internal linking / orphan pages | `/searchfit-seo:internal-linking` | |
| Find/fix broken links | `/searchfit-seo:broken-links` | Run after any restructuring or page removal |
| AI-generated-answer visibility (ChatGPT/Claude/Gemini/Perplexity, GEO/AEO) | `/searchfit-seo:ai-visibility` | Directly measures whether `llms.txt` + schema investment is actually working — see below |
| Expand a site to a new language | `/searchfit-seo:content-translation` (or `translate-content`) | Not currently needed — both sites are English-only |
| Competitor research | `searchfit-seo:competitor-analyzer` agent, or the already-used `website-intelligence` skill | Use before entering a genuinely new market (as was done for the Jacksonville/Ponte Vedra vs. Charleston decision) |
| Full autonomous audit/strategy pass (not just one file) | `searchfit-seo:seo-auditor` / `searchfit-seo:content-strategist` agents | These crawl the whole codebase themselves — use for a periodic full pass rather than a single-page check |

## Rules from this project that no generic tool knows

Carried over from [[web-dev-agent]] — re-verify these by hand every time,
regardless of which SEO skill just ran:

- **FAQ JSON-LD text must exactly match the visible FAQ text on the page.**
  A schema-generation tool has no way to know this is a hard requirement
  here — diff the generated schema against the visible `<details>` blocks
  before committing.
- **Don't let keyword clustering or content-strategy output create thin,
  templated area/location pages.** Only ship a new `areas/<city>.html` when
  there's real, specific content for that place — a keyword cluster showing
  demand for a city is not by itself a reason to publish a thin page for it.
- **Keep the two sites' keyword/content work scoped separately.** Richmond,
  VA and Ponte Vedra Beach, FL are different markets with different
  competitors and seasonality (Richmond has a winter demand drop that was
  the actual reason NEXUS exists) — never run a single keyword-clustering or
  content-strategy pass across both sites' content combined.
- **Near-duplicate prose across the two sites is still the real risk**, not
  shared structure. If `create-content` or `translate-content` is ever used
  to generate copy for one site by adapting the other's, diff it the same
  way described in [[web-dev-agent]] before publishing.
- **`areaServed` should be structured `City` entities**, not bare strings —
  check that generated schema follows this, not just that schema exists.

## Suggested recurring cadence

- `seo-check` (quick) after any content or template edit, on the page(s)
  touched.
- `seo-audit` / `technical-seo` as a periodic full pass (e.g. monthly, or
  after any batch of site changes) on each site independently.
- `broken-links` after any page rename/removal or nav restructuring.
- `ai-visibility` periodically once real content has had time to be
  (re)crawled — this is the actual feedback loop for whether the `llms.txt` +
  schema + FAQ work is paying off, not just a one-time setup checkbox.

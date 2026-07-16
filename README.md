# Fitzrovia Operational Intelligence — Concept Demos

Six working dashboard demos, three interactive model labs, and supporting docs, built as a capability demonstration for Fitzrovia Real Estate. **All data is synthetic.** Not affiliated with Fitzrovia Real Estate Inc.

## Structure

```
├── index.html                  ← landing page (start here)
├── demos/                      ← the six dashboards + architecture one-pager
├── models/
│   ├── renewal-probability.html  ← logistic regression, trained live in-browser
│   ├── hedonic-pricing.html      ← OLS amenity-premium model, fitted in-browser
│   └── llm-scoring.html          ← LLM scoring: precomputed examples + live mode
├── api/
│   └── score.js                ← Vercel serverless proxy for live LLM scoring
├── docs/
│   └── llm-scoring-methodology.md
└── README.md
```

Everything is dependency-free static HTML (Chart.js loads from CDN). The model labs contain their own synthetic-data generators, visible in page source by design — there is no real resident data anywhere in this repo.

## Preview locally

```bash
cd fitzrovia-demos
python3 -m http.server 8000
# open http://localhost:8000
```

(Opening index.html directly by double-click also works; the live-LLM panel will simply show OFFLINE.)

## Deploy to Vercel (~5 minutes)

1. Push this folder to a GitHub repo (private is fine):
   ```bash
   git init && git add -A && git commit -m "Fitzrovia concept demos"
   gh repo create fitzrovia-demos --private --source=. --push
   # or create the repo on github.com and: git remote add origin <url> && git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo. No build settings needed — Vercel serves static files and auto-detects `api/score.js` as a serverless function. Deploy.
3. You get a URL like `fitzrovia-demos-xyz.vercel.app`. To keep it semi-private, Vercel → Settings → **Deployment Protection** can require a password or Vercel login.

## Enable live LLM scoring (optional)

Without this step everything works except the "live scoring" panel in Model Lab 03 (which falls back to precomputed examples).

1. Get an API key at [console.anthropic.com](https://console.anthropic.com) (a few dollars of credit is more than enough — each score costs a fraction of a cent).
2. Vercel → your project → **Settings → Environment Variables** → add `ANTHROPIC_API_KEY` = your key → redeploy.
3. Model Lab 03 flips to **LIVE** automatically.

**How the proxy works, in one paragraph:** the browser can never hold a secret (anyone can read page source), so the page instead POSTs the text to `/api/score` — a tiny function that runs on Vercel's servers. That function attaches your key from the environment variable, calls the Claude API, and returns only the JSON score. The key never leaves the server. A per-IP rate limit (20/hour) keeps a shared link from running up costs; worst case is still pennies.

## Notes

- Demos are self-contained: each HTML file can also be sent as an email attachment and opened directly.
- `demos/4-integration-architecture-onepager.html` is print-formatted — Cmd/Ctrl+P → Save as PDF for a leave-behind.
- Model labs re-train/refit on every page load; the "regenerate" buttons prove the estimates aren't hard-coded.

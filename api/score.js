// Vercel serverless function: /api/score
// -----------------------------------------------------------
// This is the "tiny serverless proxy." The browser POSTs text
// here; this function (running on Vercel's servers, not in the
// browser) attaches the secret API key and forwards the request
// to the Claude API. The key lives in a Vercel environment
// variable (ANTHROPIC_API_KEY) — it never reaches the client.
//
// Setup (one time):
//   Vercel dashboard → your project → Settings → Environment
//   Variables → add ANTHROPIC_API_KEY = sk-ant-...
//   Redeploy. The Model Lab 03 page detects it automatically.
//
// Cost control: Haiku model + 400-token cap ≈ fractions of a
// cent per score, plus a crude per-IP rate limit below.
// -----------------------------------------------------------

const SYSTEM_PROMPT = `You are a scoring function for a rental-housing operator. Read the resident text and return ONLY valid JSON matching this schema:
{
 "sentiment": <float -1.0 to 1.0>,
 "topics": [<up to 3 strings from: elevator, maintenance_speed, noise, staff, amenities, billing, cleanliness, parking, pests, safety, communication, rent_value, move_in_out, other>],
 "severity": "low" | "medium" | "high",
 "churn_signal": <boolean - true only on explicit leaving intent or unresolved repeat failure>,
 "routing": "maintenance" | "resident_services" | "property_manager" | "none",
 "summary": "<max 15 words>"
}
Rules: no prose outside the JSON. If the text is ambiguous, use severity "low" and churn_signal false (fail conservative). Non-English input is fine; note the language in the summary if not English.`;

// crude in-memory rate limit (resets when the function cold-starts)
const hits = new Map();
const LIMIT = 20; // requests per IP per hour

export default async function handler(req, res) {
  // GET = health check used by the lab page to flip its LIVE badge
  if (req.method === 'GET') {
    if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'No API key configured' });
    return res.status(200).json({ ok: true });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'No API key configured on the server' });

  // rate limit
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  const now = Date.now();
  const rec = hits.get(ip) || { n: 0, t: now };
  if (now - rec.t > 3600_000) { rec.n = 0; rec.t = now; }
  if (++rec.n > LIMIT) return res.status(429).json({ error: 'Rate limit: 20 scores/hour. This is a demo.' });
  hits.set(ip, rec);

  const text = (req.body?.text || '').slice(0, 2000); // cap input size
  if (!text.trim()) return res.status(400).json({ error: 'No text provided' });

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',   // cheapest, plenty for structured scoring
        max_tokens: 400,
        temperature: 0,               // determinism: same text → same score
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: text }],
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: data.error?.message || 'Upstream error' });

    // The model returns JSON as text; parse it before returning
    const raw = data.content?.[0]?.text || '{}';
    const jsonStart = raw.indexOf('{');
    const parsed = JSON.parse(raw.slice(jsonStart));
    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: 'Scoring failed: ' + e.message });
  }
}

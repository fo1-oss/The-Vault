// /api/lookup.js — Vercel Serverless Function
// Proxies requests to Anthropic API so the key stays server-side
// Set ANTHROPIC_API_KEY in Vercel Environment Variables

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [
          {
            role: "user",
            content: `Look up the current resale/market price of: "${query}". Search StockX, GOAT, Chrono24, or other luxury resale marketplaces. Return ONLY a JSON object with this exact format, no other text: {"name":"full product name","brand":"brand name","category":"Sneakers|Bags|Watches|Apparel","colorway":"colorway/variant","releaseYear":2020,"retailPriceUSD":160,"currentPriceUSD":2800,"source":"marketplace name","confidence":"high|medium|low"}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "API error" });
    }

    // Extract text from response
    const text = data.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .filter(Boolean)
      .join("\n");

    // Parse JSON from response
    const cleaned = text.replace(/```json|```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);

    if (match) {
      const parsed = JSON.parse(match[0]);
      return res.status(200).json({
        ...parsed,
        retailINR: Math.round((parsed.retailPriceUSD || 0) * 85),
        currentINR: Math.round((parsed.currentPriceUSD || 0) * 85),
      });
    }

    return res.status(200).json({ error: "Could not parse pricing data", raw: text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

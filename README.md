# THE VAULT — Luxury Asset Intelligence

170+ investment-grade luxury assets. ₹ INR pricing with NIFTY 50, S&P 500, Gold, Bitcoin comparisons.

## Project Structure

```
the-vault-vercel/
├── index.html        ← Main app (React 18 via CDN, no build step)
├── vercel.json       ← Vercel deployment config
├── api/
│   └── lookup.js     ← Serverless function for AI price lookup
└── README.md
```

## Deploy to Vercel

### Step 1: Upload to GitHub (or deploy directly)

```bash
cd the-vault-vercel
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USER/the-vault.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. **Framework Preset**: Select `Other`
4. Click **Deploy**

### Step 3: Set Environment Variable (for AI Lookup)

1. Go to your project **Settings → Environment Variables**
2. Add:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: Your Anthropic API key (starts with `sk-ant-...`)
3. Redeploy for changes to take effect

### Or deploy via CLI:

```bash
npm i -g vercel
cd the-vault-vercel
vercel --prod
# When prompted, set ANTHROPIC_API_KEY in dashboard
```

## Features

- **170+ Products**: Sneakers, Bags, Watches, Apparel with retail/resale prices
- **₹ INR Pricing**: All values in Indian Rupees (₹85/USD rate)
- **Investment Calculator**: "If I invested ₹X at launch, what's it worth now?"
- **Benchmark Comparison**: vs NIFTY 50, S&P 500, Gold, Bitcoin, FD, PPF
- **AI Price Lookup**: Search any luxury item via Claude API + web search
- **Browse 170+ Items**: Filter by category, brand, sort by ROI/price/year

## Tech Stack

- **Frontend**: React 18 (CDN, zero build step), inline CSS
- **Backend**: Vercel Serverless Function (Node.js)
- **AI**: Anthropic Claude API with web search tool
- **Hosting**: Vercel (static + serverless)

## No Build Required

The app uses React via CDN + Babel in-browser transpilation. No `npm install`, no webpack, no build step. Just deploy the folder as-is.

## Notes

- AI Lookup requires `ANTHROPIC_API_KEY` env var in Vercel
- Calculator + Browse work without any API key
- All prices are static snapshots; AI lookup fetches live prices

// src/pages/api/stock.ts
import { NextApiRequest, NextApiResponse } from 'next';
import yahooFinance from 'yahoo-finance2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { symbol } = req.query;

  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid symbol' });
  }

  try {
    const quote = await yahooFinance.quote(symbol);
    const data = {
      stock: quote.shortName || symbol,
      cmp: quote.regularMarketPrice || 0,
      peRatio: quote.trailingPE || 0,
      latestEarnings: quote.epsTrailingTwelveMonths?.toString() || 'N/A',
    };
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

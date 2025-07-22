const express = require('express');
const cors = require('cors');
const { fetchStockData } = require('./yahooFinanceFetcher'); // Correct destructuring import

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/stock', async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: 'Missing symbol parameter' });

  try {
    const data = await fetchStockData(symbol);
    res.json(data);
  } catch (error) {
    console.error('API error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

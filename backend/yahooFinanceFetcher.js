const yahooFinance = require('yahoo-finance2').default;

async function fetchStockData(symbol) {
  try {
    const quote = await yahooFinance.quoteSummary(symbol, {
      modules: ['price', 'summaryDetail', 'calendarEvents'],
    });

    const earningsDate = quote.calendarEvents?.earnings?.earningsDate?.[0];

    return {
      cmp: quote.price?.regularMarketPrice || 0,
      peRatio: quote.summaryDetail?.trailingPE || 0,
      latestEarnings: earningsDate
        ? new Date(earningsDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'N/A',
    };
  } catch (error) {
    console.error(`Yahoo Finance fetch error for symbol "${symbol}":`, error.message);
    return {
      cmp: 0,
      peRatio: 0,
      latestEarnings: 'N/A',
    };
  }
}

module.exports = { fetchStockData };

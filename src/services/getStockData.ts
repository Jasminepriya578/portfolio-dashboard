export async function fetchStockData(symbol: string) {
  try {
    const response = await fetch(`http://localhost:3001/api/stock?symbol=${symbol}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return {
      cmp: data.cmp,
      peRatio: data.peRatio,
      latestEarnings: data.latestEarnings,
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return { cmp: 0, peRatio: 0, latestEarnings: 'N/A' };
  }
}

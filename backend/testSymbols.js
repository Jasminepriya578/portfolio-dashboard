const { fetchStockData } = require('./yahooFinanceFetcher');
const symbols = [
  "HDFCBANK.NS", "BAJFINANCE.NS", "ICICIBANK.NS", "BAJAJHLDNG.NS",
  "AFFLE.NS", "LTIM.NS", "KPITTECH.NS", "TATATECH.NS", "BLS.NS", "TANLA.NS",
  "DMART.NS", "TATACONSUM.NS", "PIDILITIND.NS", "TATAPOWER.NS", "KPIGREEN.NS",
  "SUZLON.NS", "GENSOL.NS", "HARIOMPIPE.NS", "ASTRAL.NS", "POLYCAB.NS",
  "CLEAN.NS", "DEEPAKNTR.NS", "FINEORG.NS", "GRAVITA.NS", "SBILIFE.NS",
  "INFY.NS", "EASEMYTRIP.NS"
];


(async () => {
  for (const symbol of symbols) {
    const data = await fetchStockData(symbol);
    console.log(symbol, data);
  }
})();

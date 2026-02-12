/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const assets = data;
  if (!Array.isArray(assets)) {
    return;
  }

  // Heavy calculations simulation (Moving Average & Volatility)
  const averagePrice = assets.reduce((acc, curr) => acc + curr.price, 0) / assets.length;
  // Volatility here treated as standard deviation of changes or just max change for simplicity in this tick
  const changes = assets.map(a => a.change24h);
  const maxChange = Math.max(...changes.map(c => Math.abs(c)));

  // Calculate Standard Deviation of prices for volatility
  const mean = averagePrice;
  const squareDiffs = assets.map(a => Math.pow(a.price - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
  const stdDev = Math.sqrt(avgSquareDiff);

  const response = {
    averagePrice,
    maxChange,
    marketVolatility: stdDev,
    processedAt: new Date().toISOString()
  };

  postMessage(response);
});

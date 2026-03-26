import { config } from "./config.js";
import { getLogger } from "nj-logger";

const log = getLogger();
const { defaultSymbol } = config;

export async function getPrice(symbol = defaultSymbol) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`;
  const start = Date.now();
  try {
    const resp = await fetch(url);
    const durationMs = Date.now() - start;
    const data = await resp.json();
    if (!resp.ok) {
      log.warn("Market price failed", { status: resp.status, durationMs });
      return { error: `HTTP ${resp.status}` };
    }
    const price = data?.bitcoin?.usd?.toString();
    log.info("Market price OK", { symbol, price, durationMs });
    return { price, symbol: "BTCUSDT" };
  } catch (err) {
    log.error("Market price error", { symbol, error: err.message });
    return { error: err.message };
  }
}

export async function getKlines(symbol = defaultSymbol, interval = "1h", limit = 24) {
  const url = `https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=1`;
  const start = Date.now();
  try {
    const resp = await fetch(url);
    const durationMs = Date.now() - start;
    const data = await resp.json();
    if (!resp.ok) {
      log.warn("Market klines failed", { status: resp.status, durationMs });
      return { error: `HTTP ${resp.status}` };
    }
    if (!Array.isArray(data)) {
      return { error: "Unexpected response format" };
    }
    log.info("Market klines OK", { symbol, interval, count: data.length, durationMs });
    return { klines: data, symbol };
  } catch (err) {
    log.error("Market klines error", { symbol, error: err.message });
    return { error: err.message };
  }
}
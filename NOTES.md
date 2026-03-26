# NOTES.md

## Market Data Source
Chose CoinGecko public REST API (no API key required):
- `/simple/price` for current BTC price
- `/coins/bitcoin/ohlc` for candlestick data

Originally suggested Binance by the assessment, but Binance is geo-restricted 
on US-based servers (Render runs on Ohio). Switched to CoinGecko and documented 
the trade-off.

## Design Decisions
- **Separation of concerns:** `lib/market.js` and `lib/ollama.js` are isolated 
  modules, making them easy to test and replace independently.
- **Config via environment:** All configurable values (model, URLs, timeout) 
  live in `.env`, never hardcoded.
- **Error handling:** Every external call returns `{ error }` on failure instead 
  of throwing, so the server always responds gracefully.
- **Market context in /api/ask:** Automatically fetches current BTC price and 
  injects it into the prompt for richer answers.

## Trade-offs
- Ollama runs locally — in production would use OpenAI, Groq, or Together.ai.
- CoinGecko free tier has rate limits (429). In production would add Redis cache 
  with 30s TTL.
- No authentication on endpoints — production would need API keys or JWT.

## How I'd extend this
- **Streaming:** Use SSE to stream Ollama responses token by token.
- **Caching:** Redis or in-memory cache for price/klines with short TTL.
- **Richer context in /api/ask:** Include 24h high/low/trend summary in prompt.
- **WebSocket endpoint:** Real-time price updates pushed to clients.
- **Rate limiting:** Protect `/api/ask` from abuse.

## Deployment
Deployed on Render.com. In production would run behind nginx as reverse proxy with:
- SSL termination
- Rate limiting
- Gzip compression

## Known Issues
- `/api/ask` returns error on cloud deployment — Ollama runs locally only.
- CoinGecko free tier has rate limits. In production would cache responses.
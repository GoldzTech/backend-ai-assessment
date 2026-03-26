# NOTES.md

## Market Data Source
Chose Binance public REST API (no API key required):
- `/api/v3/ticker/price` for current price
- `/api/v3/klines` for candlestick data

Simple, reliable, and well-documented. No authentication needed for public endpoints.

## Design Decisions
- **Separation of concerns:** `lib/market.js` and `lib/ollama.js` are isolated modules, making them easy to test and replace independently.
- **Config via environment:** All configurable values (model, URLs, timeout) live in `.env`, never hardcoded.
- **Error handling:** Every external call (Binance, Ollama) returns `{ error }` on failure instead of throwing, so the server always responds gracefully.
- **Market context in /api/ask:** The endpoint automatically fetches the current BTC price and injects it into the prompt, so Ollama answers with real data instead of generic responses.

## Trade-offs
- Ollama runs locally — in production this should be a hosted model (OpenAI, Together.ai, etc.) for reliability and latency.
- No caching on market data — every request hits Binance. A simple in-memory cache with a 30s TTL would reduce latency significantly.
- No authentication on endpoints — production would need API keys or JWT.

## How I'd extend this
- **Streaming:** Use Ollama's `stream: true` and SSE to stream responses to the client token by token.
- **Caching:** Redis or in-memory cache for price/klines with short TTL.
- **More context in /api/ask:** Include klines summary (last 24h high/low/trend) in the prompt for richer answers.
- **WebSocket endpoint:** Real-time price updates pushed to connected clients.
- **Rate limiting:** Prevent abuse on `/api/ask` since LLM calls are expensive.

## Deployment
Deployed on Render.com. In a production environment, 
the app would run behind nginx as a reverse proxy with:
- SSL termination
- Rate limiting
- Gzip compression
- Static file caching
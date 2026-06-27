# المسعودي للعطور — Al-Massoudi Perfumes

متجر إلكتروني متخصص في بيع العطور والبخور والروائح اليمنية التقليدية.  
A comprehensive Arabic RTL e-commerce platform for Yemeni perfumes and incense.

## Key Technologies

- **HTML5 / CSS3** — static multi-page site with full RTL Arabic layout
- **Vanilla JavaScript** — no framework; jQuery-style patterns via plain JS
- **Bootstrap 4 CDN** (via CDN links where needed)
- **Google Fonts — Tajawal** — Arabic typeface
- **Netlify Functions** — serverless Node.js function for Telegram bot notifications
- **localStorage** — client-side persistence for cart, auth session, and user registry

## Pages

| File | Description |
|------|-------------|
| `index.html` | Home page — banner, category tabs, special offers (auth-gated), products grid |
| `store.html` | Full product catalogue with category filter |
| `signin.html` | Login page |
| `register.html` | Account registration |
| `cart.html` | Shopping cart with quantity controls |
| `place-order.html` | Checkout / delivery info form |
| `order_complete.html` | Order confirmation |
| `dashboard.html` | User account dashboard |
| `search-result.html` | Product search results |
| `product-detail.html` | Individual product detail page |

## Running Locally

```bash
# Install Netlify CLI (already available globally)
netlify dev --port 8889
```

Open http://localhost:8889 in your browser.

## Environment Variables

Set these in **Netlify → Site settings → Environment variables**:

| Variable | Description |
|----------|-------------|
| `TELEGRAM_TOKEN` | Your Telegram bot token |
| `TELEGRAM_CHAT_ID` | Your Telegram chat/user ID |

The site works without these — notifications silently no-op if unset.

## Adding More Products

Open `js/products.js` and append to the `products` array:

```js
{ id: 24, name: 'اسم المنتج', category: 'men', price: 10000, oldPrice: 12000,
  emoji: '🏺', desc: 'وصف المنتج' }
```

**Categories:** `men` | `women` | `bakhoor` | `royal` | `fragrances`

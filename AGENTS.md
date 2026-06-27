# AGENTS.md — Al-Massoudi Perfumes

## Architecture Overview

This is a **static multi-page HTML/CSS/JS site** hosted on Netlify. There is no frontend framework or bundler — pages are plain HTML files loaded directly by the browser.

## Directory Structure

```
/
├── index.html            # Home page (main entry point)
├── store.html            # Product catalogue
├── signin.html           # Login
├── register.html         # Account creation
├── product-detail.html   # Single product view (?id=N)
├── cart.html             # Shopping cart
├── place-order.html      # Checkout
├── order_complete.html   # Order confirmation (?order=MSW-XXXXXX)
├── dashboard.html        # User account dashboard
├── search-result.html    # Search results (?q=query)
├── css/
│   └── style.css         # All styles — single shared stylesheet
├── js/
│   ├── products.js       # Product data array + category mappings
│   └── main.js           # Shared utilities: cart, auth, header/footer render, toast
├── netlify/
│   └── functions/
│       └── telegram.js   # Serverless function — proxies Telegram Bot API
└── netlify.toml          # Build config; /api/notify → /.netlify/functions/telegram
```

## Key Conventions

### Script Loading
Every HTML page loads scripts in this order at the bottom of `<body>`:
1. `js/products.js` — must come first (defines `products`, `categoryNames`, `categoryClass`)
2. `js/main.js` — depends on products.js; defines shared functions
3. Inline `<script>` — page-specific logic

### Header & Footer Injection
`main.js` exports `renderHeader()` and `renderFooter()` which inject HTML into `#site-header` and `#site-footer` elements. Every page has these two placeholder divs. The header dynamically shows auth state from `localStorage`.

### Product Cards
`renderProductCard(product)` in `main.js` generates a product card HTML string. Product images are CSS gradient placeholders + emoji (no actual image files needed). Cards have an inline `onclick` handler that calls `addToCart()`.

### Authentication
- User state stored in `localStorage` key `massoudi_user` (JSON object)
- All registered users stored in `localStorage` key `massoudi_users` (array)
- Login accepts any email/password: checks the stored users array first, then falls back to creating a guest session — this is intentional for demo purposes
- After login/register, a `POST /api/notify` call is made to the Telegram function

### Cart
- Stored in `localStorage` key `massoudi_cart` as `[{id, qty}]`
- `updateCartCount()` must be called after any cart mutation; it's also called by `saveCart()`

### Special Offers Section (index.html)
- Shows the first 8 products that have `oldPrice` set
- Auth-gated: locked div shown to guests, unlocked div shown to logged-in users
- Re-evaluated on page load based on `isLoggedIn()`

### Routing / URL Params
- `product-detail.html?id=N` — integer product ID
- `search-result.html?q=query` — URL-encoded search string
- `order_complete.html?order=MSW-XXXXXX` — order number

## Telegram Function

`netlify/functions/telegram.js` is a proxy that:
1. Reads `TELEGRAM_TOKEN` and `TELEGRAM_CHAT_ID` from environment variables
2. Formats an HTML-mode message for the bot
3. POSTs to `https://api.telegram.org/bot<TOKEN>/sendMessage`
4. Returns 200 regardless of Telegram API result (non-critical path)

If env vars are not set, the function returns `{ok: true, note: 'bot not configured'}` — the site continues to work normally.

## Styling Notes

- All CSS variables defined on `:root` in `style.css` — change colors there
- RTL is set globally via `body { direction: rtl }`
- Gold brand color: `--gold: #D4AF37`, `--gold-light: #FFD700`
- Brown CTA color: `--brown: #8B4513` (login button, prices, links)
- The brand name uses a CSS `background-clip: text` gradient animation
- The announcement bar uses a shimmer animation via `::before` pseudo-element

## Adding Products

Edit `js/products.js`. Each product object:
```js
{ id: <unique int>, name: '<Arabic name>', category: '<men|women|bakhoor|royal|fragrances>',
  price: <int in YER>, oldPrice: <int or null>, emoji: '<emoji>', desc: '<Arabic description>' }
```

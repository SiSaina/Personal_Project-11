# Store Frontend

Next.js 15 storefront and seller interface for the Laravel Store API in `Personal_Project-10`.

## Setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

On macOS/Linux, use `cp .env.example .env.local`. The defaults expect the API at `http://127.0.0.1:8000` and the frontend at `http://localhost:3000`.

```dotenv
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_CURRENCY=$
```

Start the Laravel API, migrate and seed its database, then open [http://localhost:3000](http://localhost:3000).

## API integration

All services use the shared client in `services/api.js`. It provides:

- Configurable `NEXT_PUBLIC_API_URL`
- JSON request/response handling
- Automatic bearer-token authentication for protected calls
- Anonymous product, category, and image reads
- Consistent `ApiError` instances with HTTP status and Laravel validation errors
- Resolution of relative API image paths

Checkout sends one request to `POST /api/v1/orders`:

```json
{
  "addressId": 12,
  "items": [
    { "productId": 4, "quantity": 2 }
  ]
}
```

The backend calculates and stores prices and totals. Customer and seller pages consume the resulting `orders` and nested `items`; the removed legacy `orderDetails` endpoints are not used.

## Checks

```bash
npx eslint .
npm run build
```

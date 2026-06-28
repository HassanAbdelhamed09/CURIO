# Cart & Checkout Module - CURIO

This module introduces a secure, premium, and fully featured Cart & Checkout system that supports both registered members and guest shoppers.

---

## 1. Overview

The Cart & Checkout Module provides shopping cart persistence and structured guest/member checkout flows. It recalculates pricing summaries in real-time, supports percentage and fixed-value promo codes, validates stock in real-time, deducts inventory on checkout, and secures order history logs using user JWT access tokens or guest UUID identifiers.

---

## 2. File Structure

### Backend Modules (`server/src`)

- `server/src/types/express.d.ts` (extended Express Request definitions)
- `server/src/middlewares/resolveCartOwner.middleware.ts` (soft authentication and guest session tracking)
- `server/src/modules/cart/`
  - `cart.model.ts` (Cart and CartItem schemas)
  - `order.model.ts` (Order schema)
  - `promo.model.ts` (PromoCode schema)
  - `cart.types.ts` (TypeScript types for populated structures and totals)
  - `cart.service.ts` (Core cart business logic: adding, updating, removing, promo calculations, and login cart merging)
  - `order.service.ts` (Checkout process: stock checking, snapshotting, inventory decrementing, and order verification)
  - `cart.controller.ts` (HTTP handlers for cart operations)
  - `order.controller.ts` (HTTP handlers for checkout and order retrieval)
  - `cart.routes.ts` (Express router mappings)
- `server/src/seed-promo.ts` (Seeder script for mock products and active promo codes)

### Frontend Components (`client/src`)

- `client/src/api/cart.api.ts` (Axios service wrapper)
- `client/src/api/http.ts` (Axios interceptors modified to handle `x-guest-id` headers)
- `client/src/stores/cart.store.ts` (Pinia store for cart actions, loading states, totals, and toasts)
- `client/src/router/index.ts` (Vite routing definitions)
- `client/src/layouts/MainLayout.vue` (Navigation bar with dynamic cart count badge)
- `client/src/modules/catalog/pages/ProductDetailPage.vue` (Product page with quantity adjustments and Add to Cart action)
- `client/src/modules/cart/pages/`
  - `CartPage.vue` (Item lists, quantity controls, promo form, summary financials, and clear registry action)
  - `CheckoutPage.vue` (Checkout form with client-side validation and order overview)
  - `OrderSuccessPage.vue` (Confetti success screen showing order references and shipping address)

---

## 3. Database Schema Changes

We introduced three Mongoose models:

### `PromoCode`

- `code` (String, unique, uppercase, trim)
- `discountType` (String enum: `percentage`, `fixed`)
- `discountValue` (Number, positive)
- `isActive` (Boolean, default true)
- `expirationDate` (Date, optional)

### `Cart`

- `userId` (ObjectId referencing `User`, unique, sparse)
- `guestId` (String, unique, sparse)
- `items` (Array):
  - `productId` (ObjectId referencing `Product`, required)
  - `quantity` (Number, min 1)
- `promoCode` (String, optional)

### `Order`

- `userId` (ObjectId referencing `User`, optional)
- `guestId` (String, optional)
- `items` (Array):
  - `productId` (ObjectId referencing `Product`, required)
  - `name` (String, required)
  - `price` (Number, required)
  - `quantity` (Number, required)
  - `image` (String, optional)
- `shippingAddress` (Object):
  - `fullName`, `email`, `phone`, `address`, `city`, `country`, `postalCode` (Strings, required)
- `promoCode` (String, optional)
- `totals` (Object):
  - `subtotal`, `discount`, `shipping`, `tax`, `total` (Numbers, required)
- `status` (String enum: `pending`, `processing`, `shipped`, `delivered`, `cancelled`, default `pending`)

---

## 4. API Endpoints

### Cart

- `GET    /api/cart` — Retrieves the current cart and computed totals.
- `POST   /api/cart/items` — Adds/merges product into the cart. Body: `{ "productId": "...", "quantity": 1 }`.
- `PATCH  /api/cart/items/:itemId` — Updates quantity of an item. Body: `{ "quantity": 3 }`.
- `DELETE /api/cart/items/:itemId` — Removes an item from the cart.
- `DELETE /api/cart` — Clears all items in the cart.
- `POST   /api/cart/promo` — Applies a promo code. Body: `{ "code": "SAVE10" }`.
- `DELETE /api/cart/promo` — Removes the applied promo code.

### Checkout & Orders

- `POST   /api/checkout` — Places an order and clears the cart. Body: Guest Checkout Fields.
- `GET    /api/orders/:id` — Fetches a placed order details.

---

## 5. Calculations & Validation Rules

### Pricing Computations

- `subtotal` = Sum of all `item.price * item.quantity` in the cart.
- `discount` = Computed based on the active promo code (percentage or fixed), capped at `subtotal` (never negative).
- `shipping` = $10 flat rate. If `subtotal >= 100`, shipping is complimentary ($0).
- `tax` = 10% on the taxable amount: `(subtotal - discount)`.
- `total` = `subtotal - discount + shipping + tax`.

### Validation Rules

- **Duplicates**: Adding a product already in the cart updates the existing item's quantity (no double listings).
- **Quantities**: Positive integers only. If quantity is updated to `0` or below, the item is removed.
- **Stock Limit**: Adding or adjusting item quantities verifies there is sufficient inventory.
- **Promo Codes**: Rejects inactive or expired codes. Max 1 promo code per cart.
- **Checkout Fields**: `fullName`, `email` (valid email regex), `phone`, `address`, `city`, `country`, `postalCode` are strictly required.
- **Inventory Check**: Stocks are re-validated immediately before committing the order. Creating the order decrements product stocks.

---

## 6. Assumptions and Limitations

- **Payment Gateway**: Payment is bypassed. The checkout is treated as "complimentary registry curation" and shifts to a pending order status instantly.
- **Promo Stackability**: Promo codes are non-stackable (one code per cart).
- **Cart Expiration**: Guest database carts persist until they are completed during checkout or cleared.

---

## 7. Setup & Run Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB running locally or a cloud URI

### Server

1. Create a `server/.env` file following `server/.env.example`.
2. Seed the database with promo codes and mock products:
   ```bash
   cd server
   npx tsx src/seed-promo.ts
   ```
3. Run the backend development server:
   ```bash
   npm run dev
   ```

### Client

1. Ensure `client/.env` has `VITE_API_BASE_URL=http://localhost:5000/api`.
2. Start the Vite React/Vue dev server:
   ```bash
   cd client
   npm run dev
   ```

---

## 8. Local Email Testing with smtp4dev

To test email flows (such as registration and verification links) locally without sending actual emails to real addresses, we recommend using **smtp4dev**.

### What is smtp4dev?

`smtp4dev` is a mock SMTP server designed for development. It intercepts all outgoing emails sent from your application and displays them on a local web dashboard instead of delivering them to the real recipients.

### Running smtp4dev

You can run it easily via Docker:

```bash
docker run --name smtp4dev -p 3000:80 -p 2525:25 -d rnwood/smtp4dev
```

- **Web Dashboard**: accessible at `http://localhost:3000` to view intercepted emails.
- **SMTP Port**: listens on port `2525` (mapped to `25` inside the container).

### Environment Configuration (`server/.env`)

Update the SMTP/Email configuration settings in your `server/.env` file to point to your local `smtp4dev` instance:

```env
# Email Settings (smtp4dev local setup)
EMAIL_HOST=localhost
EMAIL_PORT=2525
EMAIL_USER=any_user <!-- from google cloud  -->
EMAIL_PASS=any_password
EMAIL_FROM=no-reply@curio.com
```

When CURIO sends email verifications, the messages will instantly appear in the `smtp4dev` dashboard at `http://localhost:3000`.

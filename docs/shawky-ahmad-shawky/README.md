# Member Registry: Shawky Ahmad Shawky
## Role: Lead UI/UX Designer, Frontend Architect, and Design System Engineer

As the Lead UI/UX Designer and Frontend Architect for **CURIO**, I have designed, structured, and implemented a premium, playful, and production-ready e-commerce monorepo platform. The project has been transformed from a generic web template into an industry-standard, responsive shopping experience.

---

## 🛠️ Features Completed

### 1. Brand Identity & Design System Overhaul
* **Core Stylesheet (`client/src/style.css`)**:
  * Established the **CURIO** warm, tactile color palette: off-white cream (`#fff8ef`), sandy-beige (`#f7efe5`), brand navy (`#17143f`), and energetic coral orange (`#ff6b35`).
  * Implemented an expressive typography scale using **Fredoka** (playful display headings), **Space Grotesk** (subtitles and buttons), and **Plus Jakarta Sans** (clean body text).
  * Designed physical layering shadows, custom form styles, and an animation system utilizing high-performance spring-easings (`cubic-bezier(0.34, 1.56, 0.64, 1)`) and keyframe animations (`.motion-fade-up`, `.motion-scale-in`, `.hero-float`).
  * Optimized accessibility with tactile focus indicators and reduced-motion media queries (`prefers-reduced-motion`) to freeze animations for users who request it.

### 2. Immersive E-Commerce Page Catalog
* **New Page (`client/src/modules/catalog/pages/CatalogPage.vue`)**:
  * Created a searchable, filterable product grid displaying premium curated objects (Chronographs, Duffle bags, Atelier items) with clean widescreen photography.
  * Added live text search filtering and category tab navigation with hover transitions.
  * Integrated the wishlist button overlay directly on product cards, syncing the heart icon state with the Pinia store in real time.

### 3. Professional Iconography Migration
* **Lucide Vue Integration (`@lucide/vue`)**:
  * Fully eliminated raw text icons, emojis, and custom CSS-drawn icons from all layouts and pages.
  * Replaced them with vector SVG components (`Lock`, `Sparkles`, `Heart`, `Package`, `Star`, `ShieldCheck`).
  * Upgraded `BaseInput.vue` to use dynamic `Eye`/`EyeOff` icons for password toggling.
  * Upgraded `BaseAlert.vue` to dynamically map status levels to `CheckCircle`, `AlertTriangle`, `XCircle`, `Info`, and `X` dismiss icons.

### 4. Robust Authentication Architecture & Redirect Guards
* **Auth Page Guards (`LoginPage.vue` / `RegisterPage.vue`)**:
  * Implemented mount-level checks and watchers to immediately redirect already-authenticated users away from the login and register forms to the home catalog `/` or their target destination.
  * Refactored the success callback to parse and handle `route.query.redirect` parameters. If a guest clicks a wishlist heart icon, they are redirected to login and then routed back to their intended page upon successful authentication.
  * Resolved the circular login/catalog redirect loop by mapping the home route `/` directly to the public catalog.

### 5. API Error Handling Correction
* **Axios Interceptor (`client/src/api/http.ts`)**:
  * Diagnosed and resolved a bug where the global Axios response interceptor overrode authentication credentials errors.
  * Excluded auth-related endpoints (`/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/google`) from the 401 token refresh loop. Credentials errors (like incorrect passwords) are now correctly passed to the forms and displayed (e.g. "Invalid email or password") instead of being masked by "Refresh token is missing".

### 6. Global Toast Notification Library
* **Custom Toast System (`toast.store.ts` / `BaseToastContainer.vue`)**:
  * Engineered a custom, lightweight, type-safe notification store and container.
  * Mounted the container globally at the root in `App.vue` for availability across all views.
  * Integrated success, error, and info toasts across login, registration, logout, and wishlist toggle actions.

### 7. Monorepo Workspaces & Git Cleanliness
* **Workspaces Config (`package.json`)**:
  * Configured the root `package.json` to define npm workspaces for `client` and `server` packages, enabling unified dependency installation, hoisting, and workspace package linking.
  * Configured a robust root `.gitignore` to prevent tracking of local environment folders, node dependencies, logs, and OS cache files.

---

## 📂 Project Monorepo Structure

```
ecommerce-vue/
├── package.json               # Root monorepo configuration & npm workspaces definition
├── package-lock.json          # Unified lockfile for client and server dependencies
├── .gitignore                 # Monorepo-wide Git exclusions
├── docs/
│   └── shawky-ahmad-shawky/
│       ├── README.md          # This documentation
│       └── curio_api.json     # Postman Collection for testing all backend APIs
├── client/                    # Vite + Vue 3 + TypeScript Frontend Application (curio-client)
└── server/                    # Express + Node + TypeScript Backend API (curio-server)
```

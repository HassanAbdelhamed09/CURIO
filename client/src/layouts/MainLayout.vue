<script setup lang="ts">
import { useAuthStore } from '../stores/auth.store.js';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'login' });
};
</script>

<template>
  <div class="main-layout">
    <!-- Header Navigation -->
    <header class="app-header">
      <div class="header-container">
        <!-- Luxury Brand Logo -->
        <router-link to="/" class="logo">
          Æ T H E R I S
        </router-link>
        
        <!-- Primary Navigation -->
        <nav class="navigation-bar" aria-label="Primary navigation">
          <router-link to="/" class="nav-item">Archive</router-link>
          
          <template v-if="authStore.isAuthenticated">
            <span class="nav-divider" aria-hidden="true"></span>
            <router-link to="/wishlist" class="nav-item">Curation</router-link>
            <span class="nav-divider" aria-hidden="true"></span>
            <router-link to="/profile" class="nav-item">Portal</router-link>
            <span class="nav-divider" aria-hidden="true"></span>
            <button @click="handleLogout" class="btn-logout" aria-label="Sign out of account">
              Logout
            </button>
          </template>
          
          <template v-else>
            <span class="nav-divider" aria-hidden="true"></span>
            <router-link to="/auth/login" class="nav-item nav-item-cta">
              Access Portal
            </router-link>
          </template>
        </nav>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="main-content">
      <div class="content-container">
        <router-view />
      </div>
    </main>

    <!-- Premium 3-Column Footer -->
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-columns">
          <div class="footer-col brand-col">
            <span class="footer-logo">Æ T H E R I S</span>
            <p class="footer-manifesto">
              A curated space dedicated to precision-engineered accessories, artisanal leather goods, and minimalist objects of art. Grounded in brutalist symmetry and timeless craftsmanship.
            </p>
          </div>
          
          <div class="footer-col link-col">
            <span class="footer-heading">Curation</span>
            <ul class="footer-links">
              <li><router-link to="/">The Collection</router-link></li>
              <li><router-link to="/wishlist">Private Archive</router-link></li>
              <li><a href="#">Chronometry</a></li>
              <li><a href="#">Atelier</a></li>
            </ul>
          </div>
          
          <div class="footer-col link-col">
            <span class="footer-heading">Registry</span>
            <ul class="footer-links">
              <li><router-link to="/profile">Member Portal</router-link></li>
              <li><a href="#">Support</a></li>
              <li><a href="#">Authenticity Certificate</a></li>
              <li><a href="#">Terms & Security</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p class="footer-copy">&copy; 2026 ÆTHERIS. Crafted for the discerning collector.</p>
          <span class="footer-serial">SERIAL // AE-7700-26</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-bg);
  color: var(--color-text);
  box-sizing: border-box;
}

.app-header {
  background-color: rgba(7, 8, 10, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
}

.logo {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--color-text-h);
  text-decoration: none;
  letter-spacing: 0.25em;
  transition: color 0.3s ease;
}

.logo:hover {
  color: var(--color-primary);
}

.navigation-bar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-item {
  color: var(--color-text);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 6px 12px;
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;
}

.nav-item:hover, .router-link-active {
  color: var(--color-primary);
}

.nav-divider {
  width: 1px;
  height: 12px;
  background-color: var(--color-border);
}

.btn-logout {
  background: none;
  border: none;
  color: var(--color-muted);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;
}

.btn-logout:hover {
  color: var(--color-error);
}

.btn-logout:focus-visible {
  outline: 1px solid var(--color-error);
}

.nav-item-cta {
  color: var(--color-primary) !important;
  border: 1px solid var(--color-primary);
  padding: 6px 16px;
}

.nav-item-cta:hover {
  background-color: var(--color-primary);
  color: var(--color-bg) !important;
}

.main-content {
  flex-grow: 1;
  width: 100%;
  box-sizing: border-box;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
}

/* Luxury 3-Column Footer styling */
.app-footer {
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 60px 24px 30px;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-columns {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 60px;
  margin-bottom: 50px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.footer-logo {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  letter-spacing: 0.25em;
  color: var(--color-text-h);
}

.footer-manifesto {
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--color-text);
  max-width: 400px;
}

.footer-heading {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-primary);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a {
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-border);
  padding-top: 24px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-muted);
}

.footer-copy {
  margin: 0;
}

.footer-serial {
  letter-spacing: 0.1em;
}

@media (max-width: 768px) {
  .header-container {
    padding: 16px;
    flex-direction: column;
    gap: 16px;
  }
  
  .footer-columns {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .content-container {
    padding: 40px 16px;
  }
}
</style>

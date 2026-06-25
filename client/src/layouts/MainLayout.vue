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
        <router-link to="/" class="logo">
          Shop<span class="logo-accent">Premium</span>
        </router-link>
        
        <nav class="navigation-bar" aria-label="Primary navigation">
          <router-link to="/" class="nav-item">Home</router-link>
          
          <template v-if="authStore.isAuthenticated">
            <router-link to="/wishlist" class="nav-item">Wishlist</router-link>
            <router-link to="/profile" class="nav-item">Profile</router-link>
            <button @click="handleLogout" class="btn-logout" aria-label="Sign out of account">
              Logout
            </button>
          </template>
          
          <template v-else>
            <router-link to="/auth/login" class="nav-item nav-item-cta">
              Sign In
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

    <!-- Footer -->
    <footer class="app-footer">
      <div class="footer-container">
        <p class="footer-copy">&copy; 2026 ShopPremium. All rights reserved.</p>
        <p class="footer-note">Designed for trust and premium shopping.</p>
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
  font-family: var(--font-sans);
  box-sizing: border-box;
}

.app-header {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
}

.logo {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-text-h);
  text-decoration: none;
  letter-spacing: -0.5px;
}

.logo-accent {
  color: var(--color-accent);
}

.navigation-bar {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-item {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.925rem;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.nav-item:hover, .router-link-active {
  color: var(--color-primary);
  background-color: rgba(15, 61, 94, 0.04);
}

.btn-logout {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 0.925rem;
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background-color: var(--color-bg);
  border-color: var(--color-text-h);
}

.btn-logout:focus-visible {
  outline: 2px solid var(--color-accent);
}

.nav-item-cta {
  background-color: var(--color-primary);
  color: #ffffff !important;
  padding: 8px 18px;
}

.nav-item-cta:hover {
  background-color: var(--color-primary-dark);
}

.main-content {
  flex-grow: 1;
  width: 100%;
  box-sizing: border-box;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.app-footer {
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 24px 24px;
  text-align: center;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-copy {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-h);
}

.footer-note {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-muted);
}

@media (max-width: 640px) {
  .header-container {
    padding: 14px 16px;
  }
  .content-container {
    padding: 24px 16px;
  }
  .navigation-bar {
    gap: 12px;
  }
  .nav-item {
    font-size: 0.875rem;
  }
}
</style>

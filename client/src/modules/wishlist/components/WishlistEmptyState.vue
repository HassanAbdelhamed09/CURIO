<script setup lang="ts">
import BaseButton from '../../../components/ui/BaseButton.vue';

/**
 * WishlistEmptyState Component
 * A beautifully designed empty state encouraging users to explore the store catalog.
 */
</script>

<template>
  <div class="wishlist-empty">
    <!-- Heart Icon Graphics -->
    <div class="empty-icon-wrapper" aria-hidden="true">
      <svg
        class="empty-heart-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </div>

    <!-- Explanation Copy -->
    <h3 class="empty-title">Your Wishlist is Empty</h3>
    <p class="empty-description">
      Save items you love here so you can easily track, buy, or share them later.
    </p>

    <!-- Exploration CTA -->
    <router-link to="/" class="explore-link">
      <BaseButton variant="primary" class="explore-btn">
        Explore Products
      </BaseButton>
    </router-link>
  </div>
</template>

<style scoped>
.wishlist-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 32px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  max-width: 500px;
  margin: 0 auto;
  box-sizing: border-box;
}

.empty-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: rgba(15, 61, 94, 0.05);
  color: var(--color-primary);
  margin-bottom: 24px;
}

/* Subtle dark mode adjust for icon wrapper background */
@media (prefers-color-scheme: dark) {
  .empty-icon-wrapper {
    background-color: rgba(245, 158, 11, 0.1);
    color: var(--color-accent);
  }
}

.empty-heart-icon {
  width: 36px;
  height: 36px;
}

.empty-title {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-text-h);
  margin: 0 0 10px 0;
}

.empty-description {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--color-muted);
  line-height: 150%;
  margin: 0 0 32px 0;
  max-width: 340px;
}

.explore-link {
  text-decoration: none;
  width: 100%;
  max-width: 200px;
}

.explore-btn {
  width: 100%;
}
</style>

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
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </div>

    <!-- Explanation Copy -->
    <h3 class="empty-title">Archive Vacant</h3>
    <p class="empty-description">
      Your private collection archive is currently empty. Explore the active curation to save masterworks of interest.
    </p>

    <!-- Exploration CTA -->
    <router-link to="/" class="explore-link">
      <BaseButton variant="primary" class="explore-btn">
        Browse Collection
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
  padding: 80px 40px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  max-width: 500px;
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
}

.wishlist-empty::before {
  content: '+';
  position: absolute;
  top: -9px;
  left: -5px;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--color-primary);
  opacity: 0.6;
}

.empty-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border: 1px solid var(--color-border);
  color: var(--color-primary);
  margin-bottom: 32px;
}

.empty-heart-icon {
  width: 32px;
  height: 32px;
}

.empty-title {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 400;
  color: var(--color-text-h);
  margin: 0 0 12px 0;
}

.empty-description {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--color-text);
  line-height: 1.6;
  margin: 0 0 32px 0;
  max-width: 340px;
}

.explore-link {
  text-decoration: none;
  width: 100%;
  max-width: 220px;
}

.explore-btn {
  width: 100%;
}
</style>

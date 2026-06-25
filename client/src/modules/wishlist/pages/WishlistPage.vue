<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useWishlistStore } from '../../../stores/wishlist.store.js';
import WishlistEmptyState from '../components/WishlistEmptyState.vue';
import BaseLoader from '../../../components/ui/BaseLoader.vue';
import BaseAlert from '../../../components/ui/BaseAlert.vue';
import BaseButton from '../../../components/ui/BaseButton.vue';

const wishlistStore = useWishlistStore();
const removingId = ref<string | null>(null);

// Load wishlist on mount
onMounted(async () => {
  try {
    await wishlistStore.fetchWishlist();
  } catch (err) {
    console.error('Failed to fetch user wishlist details', err);
  }
});

// Mock resolver mapping stored productIds to rich product details (mocking Product Catalog Member 2 integration)
const resolveProductDetails = (productId: string) => {
  const catalog: Record<string, { name: string; price: number; image: string; category: string }> = {
    '60d5ecb863a6c22c5c8b4999': {
      name: 'Signature Chronograph Leather Watch',
      price: 249.00,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
      category: 'Accessories',
    },
    '60d5ecb863a6c22c5c8b4998': {
      name: 'Premium Leather Overnight Duffle',
      price: 189.00,
      image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=300&q=80',
      category: 'Bags',
    },
    'default': {
      name: `Premium Marketplace Item (${productId.substring(0, 8)})`,
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
      category: 'Marketplace',
    }
  };

  return catalog[productId] || {
    ...catalog['default'],
    name: `Premium Marketplace Item (${productId.substring(0, 8)})`
  };
};

const handleRemoveItem = async (productId: string) => {
  removingId.value = productId;
  try {
    await wishlistStore.removeFromWishlist(productId);
  } catch (err) {
    console.error(err);
  } finally {
    removingId.value = null;
  }
};
</script>

<template>
  <div class="wishlist-view">
    <header class="page-header">
      <h1 class="page-title">My Wishlist</h1>
      <p class="page-subtitle">Manage the premium items you've saved for later</p>
    </header>

    <!-- 1. Loading State -->
    <BaseLoader v-if="wishlistStore.loading && !removingId" text="Loading your saved wishlist items..." />
    
    <!-- 2. Error State -->
    <BaseAlert v-else-if="wishlistStore.error" type="error" :message="wishlistStore.error" />

    <!-- 3. Success State -->
    <div v-else class="wishlist-container">
      <!-- Empty State -->
      <WishlistEmptyState v-if="!wishlistStore.wishlist || wishlistStore.wishlist.items.length === 0" />

      <!-- Active Wishlist Grid -->
      <div v-else class="wishlist-grid-layout">
        <div
          v-for="item in wishlistStore.wishlist.items"
          :key="item.productId"
          class="wishlist-item-card"
        >
          <!-- Product image block -->
          <div class="product-image-wrapper">
            <img
              :src="resolveProductDetails(item.productId).image"
              :alt="resolveProductDetails(item.productId).name"
              class="product-image"
              loading="lazy"
            />
            <span class="product-category-tag">
              {{ resolveProductDetails(item.productId).category }}
            </span>
          </div>

          <!-- Product Details Block -->
          <div class="product-details">
            <div class="meta-row">
              <h3 class="product-title">
                {{ resolveProductDetails(item.productId).name }}
              </h3>
              <p class="product-price">
                ${{ resolveProductDetails(item.productId).price.toFixed(2) }}
              </p>
            </div>
            
            <p class="integration-notice">
              ID: {{ item.productId }}
            </p>
            
            <!-- Actions (Add to Cart placeholder, and Remove CTA) -->
            <div class="product-card-actions">
              <!-- Clear/Move to Cart visual button -->
              <BaseButton variant="secondary" size="sm" class="btn-cart">
                Add to Cart
              </BaseButton>
              
              <BaseButton
                variant="ghost"
                size="sm"
                :loading="removingId === item.productId"
                @click="handleRemoveItem(item.productId)"
                class="btn-remove"
              >
                Remove
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wishlist-view {
  width: 100%;
}

.page-header {
  margin-bottom: 32px;
  text-align: left;
}

.page-title {
  font-family: var(--font-heading);
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--color-text-h);
  margin: 0 0 6px 0;
  letter-spacing: -0.75px;
}

.page-subtitle {
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-muted);
  margin: 0;
}

.wishlist-grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 24px;
}

.wishlist-item-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.wishlist-item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 Aspect Ratio */
  background-color: var(--color-bg);
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.wishlist-item-card:hover .product-image {
  transform: scale(1.04);
}

.product-category-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: rgba(15, 61, 94, 0.85);
  backdrop-filter: blur(4px);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 0.725rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  flex-grow: 1;
  text-align: left;
}

.meta-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text-h);
  line-height: 135%;
  /* Clamp text to 2 lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.7em;
}

.product-price {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-primary);
}

/* Dark mode adjustment for price contrast */
@media (prefers-color-scheme: dark) {
  .product-price {
    color: var(--color-accent);
  }
}

.integration-notice {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--color-muted);
  margin: 0;
}

.product-card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.btn-cart {
  width: 100%;
}

.btn-remove {
  width: 100%;
  color: var(--color-muted) !important;
}

.btn-remove:hover {
  color: var(--color-error) !important;
  background-color: rgba(239, 68, 68, 0.05) !important;
}
</style>

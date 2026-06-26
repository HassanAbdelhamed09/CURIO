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
      category: 'Chronometry',
    },
    '60d5ecb863a6c22c5c8b4998': {
      name: 'Premium Leather Overnight Duffle',
      price: 189.00,
      image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=300&q=80',
      category: 'Leather Goods',
    },
    'default': {
      name: `Premium Curation Item (${productId.substring(0, 8)})`,
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
      category: 'Exhibition',
    }
  };

  return catalog[productId] || {
    ...catalog['default'],
    name: `Premium Curation Item (${productId.substring(0, 8)})`
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
      <span class="page-eyebrow">PORTAL // ARCHIVE COLLECTIONS</span>
      <h1 class="page-title">Private Archive</h1>
      <p class="page-subtitle">A curated index of your selected masterworks, precision instruments, and personal treasures.</p>
    </header>

    <!-- 1. Loading State -->
    <BaseLoader v-if="wishlistStore.loading && !removingId" text="Retrieving archived curations..." />
    
    <!-- 2. Error State -->
    <BaseAlert v-else-if="wishlistStore.error" type="error" :message="wishlistStore.error" />

    <!-- 3. Success State -->
    <div v-else class="wishlist-container">
      <!-- Empty State -->
      <WishlistEmptyState v-if="!wishlistStore.wishlist || wishlistStore.wishlist.items.length === 0" />

      <!-- Active Wishlist Grid (Art Gallery Exhibition Grid) -->
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
              [ {{ resolveProductDetails(item.productId).category }} ]
            </span>
          </div>

          <!-- Product Details Block -->
          <div class="product-details">
            <div class="meta-row">
              <span class="product-serial">CATALOG REF // {{ item.productId.substring(0, 10).toUpperCase() }}</span>
              <h3 class="product-title">
                {{ resolveProductDetails(item.productId).name }}
              </h3>
              <p class="product-price">
                ${{ resolveProductDetails(item.productId).price.toFixed(2) }}
              </p>
            </div>
            
            <!-- Actions (Add to Cart placeholder, and Remove CTA) -->
            <div class="product-card-actions">
              <BaseButton variant="primary" size="sm" class="btn-cart">
                Acquire
              </BaseButton>
              
              <BaseButton
                variant="ghost"
                size="sm"
                :loading="removingId === item.productId"
                @click="handleRemoveItem(item.productId)"
                class="btn-remove"
              >
                Release
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
  margin-bottom: 40px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 24px;
}

.page-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--color-primary);
  display: block;
  margin-bottom: 8px;
}

.page-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 400;
  color: var(--color-text-h);
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--color-text);
  margin: 0;
}

.wishlist-grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 32px;
}

/* Luxury Card (Art Gallery Exhibition Grid) */
.wishlist-item-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  position: relative;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-sizing: border-box;
}

.wishlist-item-card::before {
  content: '+';
  position: absolute;
  top: -9px;
  left: -5px;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--color-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.wishlist-item-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
}

.wishlist-item-card:hover::before {
  opacity: 0.8;
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 85%; /* Slightly taller than 4:3 for elegant scale */
  background-color: var(--color-bg);
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(15%);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.wishlist-item-card:hover .product-image {
  transform: scale(1.05);
  filter: grayscale(0%);
}

.product-category-tag {
  position: absolute;
  top: 16px;
  left: 16px;
  background-color: rgba(7, 8, 10, 0.85);
  backdrop-filter: blur(4px);
  color: var(--color-primary);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border: 1px solid rgba(197, 168, 128, 0.2);
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  flex-grow: 1;
  text-align: left;
}

.meta-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.product-serial {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  color: var(--color-muted);
}

.product-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--color-text-h);
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.5em;
}

.product-price {
  margin: 8px 0 0 0;
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-primary);
}

.product-card-actions {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.btn-cart {
  width: 100%;
}

.btn-remove {
  width: 100%;
  color: var(--color-muted) !important;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
}

.btn-remove:hover {
  color: var(--color-error) !important;
  border-bottom-color: var(--color-error) !important;
}
</style>

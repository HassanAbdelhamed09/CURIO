<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { cartApi } from '../../../api/cart.api.js';
import type { OrderData } from '../../../api/cart.api.js';
import BaseButton from '../../../components/ui/BaseButton.vue';
import { Sparkles, Calendar, CheckCircle, MapPin, Package } from '@lucide/vue';

const route = useRoute();
const router = useRouter();
const order = ref<OrderData | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const orderId = route.params.id as string;
  try {
    const response = await cartApi.getOrderById(orderId);
    if (response.success && response.data) {
      order.value = response.data;
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to retrieve order confirmation details.';
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<template>
  <div class="order-success-view">
    <!-- Loading State -->
    <div v-if="loading" class="order-loading">
      <div class="spinner motion-shimmer"></div>
      <p>Retrieving curation registry confirmation...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="order-error motion-scale-in">
      <CheckCircle class="error-icon" style="color: var(--color-danger);" />
      <h3 class="error-title">Unable to Verify Order</h3>
      <p class="error-description">{{ error }}</p>
      <BaseButton variant="primary" @click="router.push({ name: 'home' })">
        Return to Catalog
      </BaseButton>
    </div>

    <!-- Success Content -->
    <div v-else-if="order" class="success-container motion-fade-up">
      <!-- Celebration Hero -->
      <div class="celebration-hero">
        <div class="success-badge-wrapper">
          <CheckCircle class="success-check-icon" />
        </div>
        <span class="success-eyebrow">ORDER ACQUIRED</span>
        <h1 class="success-title">Thank you for your curation.</h1>
        <p class="success-subtitle">
          Your order has been established on the registry. A dispatch confirmation has been logged.
        </p>
      </div>

      <div class="order-details-grid">
        <!-- Details Card -->
        <div class="details-main-col">
          <!-- Metadata block -->
          <div class="info-card info-card--meta">
            <div class="meta-item">
              <span class="meta-label">ORDER REFERENCE</span>
              <span class="meta-val font-mono">{{ order._id.toUpperCase() }}</span>
            </div>
            
            <div class="meta-item">
              <div class="meta-label-row">
                <Calendar class="meta-icon" />
                <span class="meta-label">ESTABLISHED</span>
              </div>
              <span class="meta-val">{{ formatDate(order.createdAt) }}</span>
            </div>

            <div class="meta-item">
              <div class="meta-label-row">
                <CheckCircle class="meta-icon" />
                <span class="meta-label">STATUS</span>
              </div>
              <span class="meta-val status-badge">{{ order.status.toUpperCase() }}</span>
            </div>
          </div>

          <!-- Items list -->
          <div class="info-card">
            <h2 class="card-title-heading">
              <Package class="card-title-icon" /> Curated Registry Items
            </h2>
            <ul class="purchased-items-list">
              <li v-for="item in order.items" :key="item.productId" class="purchased-item-row">
                <img 
                  v-if="item.image" 
                  :src="item.image" 
                  :alt="item.name" 
                  class="purchased-item-img"
                />
                <div v-else class="purchased-item-img-placeholder">
                  <Package class="placeholder-icon" />
                </div>

                <div class="purchased-item-details">
                  <span class="purchased-item-name">{{ item.name }}</span>
                  <span class="purchased-item-price-qty">
                    ${{ item.price.toFixed(2) }} × {{ item.quantity }}
                  </span>
                </div>

                <span class="purchased-item-total">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Sidebar Col -->
        <div class="details-sidebar-col">
          <!-- Shipping Address -->
          <div class="info-card">
            <h2 class="card-title-heading">
              <MapPin class="card-title-icon" /> Shipping Address
            </h2>
            <div class="shipping-details">
              <span class="shipping-name">{{ order.shippingAddress.fullName }}</span>
              <span class="shipping-address">{{ order.shippingAddress.address }}</span>
              <span class="shipping-city">
                {{ order.shippingAddress.city }}, {{ order.shippingAddress.postalCode }}
              </span>
              <span class="shipping-country">{{ order.shippingAddress.country }}</span>
              
              <div class="shipping-contact-divider"></div>
              
              <span class="shipping-contact-label">Email</span>
              <span class="shipping-contact-val">{{ order.shippingAddress.email }}</span>
              <span class="shipping-contact-label">Phone</span>
              <span class="shipping-contact-val">{{ order.shippingAddress.phone }}</span>
            </div>
          </div>

          <!-- Totals Summary -->
          <div class="info-card">
            <h2 class="card-title-heading">
              <Sparkles class="card-title-icon" /> Order Financials
            </h2>
            
            <div class="totals-breakdown">
              <div class="totals-row">
                <span>Subtotal</span>
                <span>${{ order.totals.subtotal.toFixed(2) }}</span>
              </div>

              <div v-if="order.totals.discount > 0" class="totals-row totals-row--discount">
                <span>Atelier Discount ({{ order.promoCode }})</span>
                <span>-${{ order.totals.discount.toFixed(2) }}</span>
              </div>

              <div class="totals-row">
                <span>Shipping</span>
                <span>
                  {{ order.totals.shipping === 0 ? 'Free' : `$${order.totals.shipping.toFixed(2)}` }}
                </span>
              </div>

              <div class="totals-row">
                <span>Tax (10%)</span>
                <span>${{ order.totals.tax.toFixed(2) }}</span>
              </div>

              <div class="totals-row totals-row--grand font-mono">
                <span>Grand Total</span>
                <span>${{ order.totals.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="success-actions">
        <BaseButton variant="primary" @click="router.push({ name: 'home' })">
          Continue Discoveries
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-success-view {
  width: 100%;
}

/* Loading state */
.order-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 100px 0;
  color: var(--color-muted);
}

.spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.order-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 40px;
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  max-width: 500px;
  margin: 40px auto;
}

.error-icon {
  width: 54px;
  height: 54px;
  margin-bottom: 20px;
}

.error-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 10px 0;
}

.error-description {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--color-muted);
  line-height: 1.6;
  margin: 0 0 24px 0;
}

/* Success Container */
.success-container {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.celebration-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  gap: 12px;
}

.success-badge-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(22, 163, 74, 0.08);
  color: var(--color-success);
  margin-bottom: 12px;
}

.success-check-icon {
  width: 40px;
  height: 40px;
}

.success-eyebrow {
  font-family: var(--font-display);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  font-weight: 700;
  color: var(--color-accent);
}

.success-title {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.success-subtitle {
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-muted);
  line-height: 1.6;
  margin: 0;
}

/* Details Grid */
.order-details-grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 40px;
  align-items: start;
}

@media (max-width: 992px) {
  .order-details-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.info-card {
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: var(--shadow-card);
  text-align: left;
}

.card-title-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 12px;
}

.card-title-icon {
  width: 18px;
  height: 18px;
  color: var(--color-accent);
}

/* Meta details card */
.info-card--meta {
  flex-direction: row;
  justify-content: space-between;
  background-color: var(--color-bg-alt);
  padding: 24px 32px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-label-row {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-muted);
}

.meta-icon {
  width: 14px;
  height: 14px;
}

.meta-label {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--color-muted);
}

.meta-val {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
}

.status-badge {
  color: var(--color-success);
  font-family: var(--font-display);
  letter-spacing: 0.05em;
}

@media (max-width: 576px) {
  .info-card--meta {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }
}

/* Purchased Items List */
.purchased-items-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.purchased-item-row {
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 16px;
}

.purchased-item-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.purchased-item-img {
  width: 54px;
  height: 54px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-alt);
}

.purchased-item-img-placeholder {
  width: 54px;
  height: 54px;
  border-radius: var(--radius-sm);
  background-color: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
}

.placeholder-icon {
  width: 20px;
  height: 20px;
}

.purchased-item-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.purchased-item-name {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-primary);
}

.purchased-item-price-qty {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-muted);
}

.purchased-item-total {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-primary);
}

/* Shipping Details */
.shipping-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  line-height: 1.5;
  font-family: var(--font-sans);
  font-size: 0.95rem;
}

.shipping-name {
  font-weight: 700;
  color: var(--color-primary);
}

.shipping-address, .shipping-city, .shipping-country {
  color: var(--color-muted);
}

.shipping-contact-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 10px 0;
}

.shipping-contact-label {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.shipping-contact-val {
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 8px;
}

/* Financials Breakdown */
.totals-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.totals-row {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--color-muted);
}

.totals-row span:last-child {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--color-primary);
}

.totals-row--discount {
  color: var(--color-success);
}

.totals-row--discount span:last-child {
  color: var(--color-success);
}

.totals-row--grand {
  border-top: 2px dashed var(--color-border);
  padding-top: 16px;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-primary);
}

.totals-row--grand span:last-child {
  font-size: 1.25rem;
  color: var(--color-accent);
}

.success-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>

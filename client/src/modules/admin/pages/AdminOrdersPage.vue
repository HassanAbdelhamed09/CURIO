<script setup lang="ts">
/**
 * AdminOrdersPage
 * Administrative Order Management dashboard.
 * Uses BaseTable, BasePagination, BaseModal, and BaseConfirmDialog.
 */
import { ref, onMounted, watch } from 'vue';
import { adminApi, type OrderRegistryItem } from '../../../api/admin.api.js';
import { useToastStore } from '../../../stores/toast.store.js';
import {
  Search,
  Eye,
  CheckCircle,
  Truck,
  PackageCheck,
  AlertTriangle,
  XCircle,
  Calendar,
  User,
  ShoppingBag,
} from '@lucide/vue';

// UI Base Components
import BaseTable from '../../../components/ui/BaseTable.vue';
import BaseModal from '../../../components/ui/BaseModal.vue';
import BaseConfirmDialog from '../../../components/ui/BaseConfirmDialog.vue';
import BaseSelect from '../../../components/ui/BaseSelect.vue';

const toastStore = useToastStore();

const loading = ref(true);
const error = ref<string | null>(null);

const orders = ref<OrderRegistryItem[]>([]);
const filteredOrders = ref<OrderRegistryItem[]>([]);
const search = ref('');
const statusFilter = ref('');

// Table Headers
const tableHeaders = [
  { key: 'orderNumber', label: 'Order Number' },
  { key: 'customer', label: 'Customer' },
  { key: 'sellers', label: 'Seller(s)' },
  { key: 'amount', label: 'Amount' },
  { key: 'payment', label: 'Payment' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Date' },
  { key: 'actions', label: 'Actions', align: 'right' as const },
];

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

// Detail Modal state
const showViewModal = ref(false);
const activeOrder = ref<OrderRegistryItem | null>(null);

// Confirmation Dialog state
const showConfirmDialog = ref(false);
const confirmDialogTitle = ref('');
const confirmDialogMessage = ref('');
const confirmDialogVariant = ref<'primary' | 'danger' | 'warning'>('primary');
const confirmDialogLoading = ref(false);
const onConfirmCallback = ref<(() => Promise<void>) | null>(null);

const fetchOrders = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await adminApi.fetchOrders();
    if (response.success && response.data) {
      orders.value = response.data;
      applyFilters();
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to retrieve order history.';
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  let list = [...orders.value];

  // Filter by Status
  if (statusFilter.value) {
    list = list.filter((o) => o.status === statusFilter.value);
  }

  // Filter by Search Keyword (Order Number or Customer Name)
  if (search.value.trim()) {
    const term = search.value.trim().toLowerCase();
    list = list.filter((o) => {
      const orderIdMatch = o._id.toLowerCase().includes(term);
      const customerNameMatch = o.shippingAddress.fullName.toLowerCase().includes(term);
      const emailMatch = o.shippingAddress.email.toLowerCase().includes(term);
      
      // Comma-separated sellers match
      const sellersStr = getSellersText(o).toLowerCase();
      const sellersMatch = sellersStr.includes(term);
      
      return orderIdMatch || customerNameMatch || emailMatch || sellersMatch;
    });
  }

  filteredOrders.value = list;
};

// Watchers
watch([search, statusFilter], () => {
  applyFilters();
});

onMounted(() => {
  fetchOrders();
});

// Helper: format unique list of sellers for an order
const getSellersText = (order: OrderRegistryItem): string => {
  const sellers = new Set<string>();
  order.items.forEach((item) => {
    const sellerName = item.productId?.seller?.fullName;
    if (sellerName) {
      sellers.add(sellerName);
    }
  });
  return sellers.size > 0 ? Array.from(sellers).join(', ') : 'CURIO Gallery';
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const statusBadgeClass = (status: string): string => {
  const mapping: Record<string, string> = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    processing: 'badge-processing',
    shipped: 'badge-shipped',
    delivered: 'badge-delivered',
    cancelled: 'badge-cancelled',
  };
  return mapping[status] || 'badge-default';
};

const paymentBadgeClass = (status: string): string => {
  const mapping: Record<string, string> = {
    pending: 'badge-pending',
    paid: 'badge-paid',
    failed: 'badge-failed',
  };
  return mapping[status] || 'badge-default';
};

const openViewModal = (order: OrderRegistryItem) => {
  activeOrder.value = order;
  showViewModal.value = true;
};

const closeModals = () => {
  showViewModal.value = false;
  activeOrder.value = null;
};

// Dialog Trigger helper
const triggerConfirm = (
  title: string,
  message: string,
  variant: 'primary' | 'danger' | 'warning',
  onConfirm: () => Promise<void>
) => {
  confirmDialogTitle.value = title;
  confirmDialogMessage.value = message;
  confirmDialogVariant.value = variant;
  onConfirmCallback.value = onConfirm;
  showConfirmDialog.value = true;
};

const handleConfirmAction = async () => {
  if (onConfirmCallback.value) {
    confirmDialogLoading.value = true;
    try {
      await onConfirmCallback.value();
      showConfirmDialog.value = false;
    } catch (err) {
      // Errors handled in callback
    } finally {
      confirmDialogLoading.value = false;
      onConfirmCallback.value = null;
    }
  }
};

const handleConfirmCancel = () => {
  onConfirmCallback.value = null;
};

// Moderation Operations
const handleStatusUpdate = (order: OrderRegistryItem, newStatus: any) => {
  const variant = newStatus === 'cancelled' ? 'danger' : 'primary';

  triggerConfirm(
    'Update Order Status',
    `Are you sure you want to change the status of Order #${order._id.substring(18)} to "${newStatus}"?`,
    variant,
    async () => {
      try {
        const response = await adminApi.updateOrderStatus(order._id, newStatus);
        if (response.success) {
          toastStore.success(`Order advanced to status: ${newStatus}.`);
          fetchOrders();
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message || 'Failed to update order status.';
        toastStore.error(msg);
        throw err;
      }
    }
  );
};
</script>

<template>
  <div class="admin-orders-page">
    <!-- Header -->
    <header class="page-header">
      <div>
        <h1 class="page-title">Order Management</h1>
        <p class="page-subtitle">Track payments, advance logistics statuses, and manage fulfillment.</p>
      </div>
    </header>

    <!-- Toolbar Filters -->
    <section class="controls-toolbar">
      <div class="search-input-wrap">
        <Search class="search-icon" />
        <input
          v-model="search"
          type="text"
          placeholder="Search by Order #, Customer, or Seller..."
          class="search-input-box"
        />
      </div>

      <div class="filter-select-wrap">
        <BaseSelect v-model="statusFilter" :options="statusOptions" placeholder="Filter by Status" />
      </div>
    </section>

    <!-- Error -->
    <div v-if="error" class="error-banner">
      <AlertTriangle class="error-icon" />
      <h3>Failed to load orders history</h3>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchOrders">Retry</button>
    </div>

    <!-- Orders Table -->
    <template v-else>
      <BaseTable
        :headers="tableHeaders"
        :items="filteredOrders"
        :loading="loading"
        emptyText="No Curation Orders Found"
      >
        <!-- Cell: Order Number -->
        <template #cell(orderNumber)="{ item }">
          <span class="order-id-label">#{{ item._id.substring(18) }}</span>
        </template>

        <!-- Cell: Customer -->
        <template #cell(customer)="{ item }">
          <div class="customer-info-cell">
            <span class="customer-name">{{ item.shippingAddress.fullName }}</span>
            <span class="customer-email">{{ item.shippingAddress.email }}</span>
          </div>
        </template>

        <!-- Cell: Sellers -->
        <template #cell(sellers)="{ item }">
          <span class="sellers-text">{{ getSellersText(item) }}</span>
        </template>

        <!-- Cell: Amount -->
        <template #cell(amount)="{ item }">
          <strong>${{ item.totals.total.toFixed(2) }}</strong>
        </template>

        <!-- Cell: Payment -->
        <template #cell(payment)="{ item }">
          <div class="payment-info-cell">
            <span :class="['status-badge', paymentBadgeClass(item.paymentStatus)]">
              {{ item.paymentStatus }}
            </span>
            <span class="payment-method-desc">via {{ item.paymentMethod === 'cash' ? 'COD' : 'Stripe' }}</span>
          </div>
        </template>

        <!-- Cell: Status -->
        <template #cell(status)="{ item }">
          <span :class="['status-badge', statusBadgeClass(item.status)]">
            {{ item.status }}
          </span>
        </template>

        <!-- Cell: Date -->
        <template #cell(createdAt)="{ item }">
          <span class="date-cell">{{ formatDate(item.createdAt) }}</span>
        </template>

        <!-- Cell: Actions -->
        <template #cell(actions)="{ item }">
          <div class="actions-buttons">
            <button class="action-btn" title="View Order Breakdown" @click="openViewModal(item)">
              <Eye class="action-icon" />
            </button>

            <!-- confirmed -->
            <button
              v-if="item.status === 'pending'"
              class="action-btn action-confirm"
              title="Confirm Order"
              @click="handleStatusUpdate(item, 'confirmed')"
            >
              <CheckCircle class="action-icon" />
            </button>

            <!-- processing -->
            <button
              v-if="item.status === 'confirmed'"
              class="action-btn action-process"
              title="Start Processing"
              @click="handleStatusUpdate(item, 'processing')"
            >
              <PackageCheck class="action-icon" />
            </button>

            <!-- shipped -->
            <button
              v-if="item.status === 'processing'"
              class="action-btn action-ship"
              title="Ship Package"
              @click="handleStatusUpdate(item, 'shipped')"
            >
              <Truck class="action-icon" />
            </button>

            <!-- delivered -->
            <button
              v-if="item.status === 'shipped'"
              class="action-btn action-deliver"
              title="Mark Delivered"
              @click="handleStatusUpdate(item, 'delivered')"
            >
              <CheckCircle class="action-icon" />
            </button>

            <!-- Cancel -->
            <button
              v-if="item.status !== 'delivered' && item.status !== 'cancelled'"
              class="action-btn action-cancel"
              title="Cancel Order"
              @click="handleStatusUpdate(item, 'cancelled')"
            >
              <XCircle class="action-icon" />
            </button>
          </div>
        </template>
      </BaseTable>
    </template>

    <!-- MODAL: View Order Details -->
    <BaseModal :show="showViewModal" title="Order Curation Breakdown" size="lg" @close="closeModals">
      <div v-if="activeOrder" class="details-modal-grid">
        <!-- Panel 1: Customer Details -->
        <div class="details-section shadow-section">
          <h3 class="details-section-title"><User class="section-icon" /> Customer & Delivery</h3>
          <div class="details-read-grid">
            <div class="read-group">
              <span class="read-label">Full Name</span>
              <span class="read-value">{{ activeOrder.shippingAddress.fullName }}</span>
            </div>
            <div class="read-group">
              <span class="read-label">Contact Email</span>
              <span class="read-value">{{ activeOrder.shippingAddress.email }}</span>
            </div>
            <div class="read-group">
              <span class="read-label">Contact Phone</span>
              <span class="read-value">{{ activeOrder.shippingAddress.phone }}</span>
            </div>
            <div class="read-group read-group--full">
              <span class="read-label">Shipping Address</span>
              <span class="read-value">
                {{ activeOrder.shippingAddress.address }}, {{ activeOrder.shippingAddress.city }},
                {{ activeOrder.shippingAddress.country }} (ZIP: {{ activeOrder.shippingAddress.postalCode }})
              </span>
            </div>
          </div>
        </div>

        <!-- Panel 2: Order Metadata & Status -->
        <div class="details-section shadow-section">
          <h3 class="details-section-title"><Calendar class="section-icon" /> Logistics & Payment</h3>
          <div class="details-read-grid">
            <div class="read-group">
              <span class="read-label">Order Number</span>
              <span class="read-value mono">#{{ activeOrder._id }}</span>
            </div>
            <div class="read-group">
              <span class="read-label">Order Date</span>
              <span class="read-value">{{ formatDate(activeOrder.createdAt) }}</span>
            </div>
            <div class="read-group">
              <span class="read-label">Fulfillment Status</span>
              <span class="read-value">
                <span :class="['status-badge', statusBadgeClass(activeOrder.status)]">
                  {{ activeOrder.status }}
                </span>
              </span>
            </div>
            <div class="read-group">
              <span class="read-label">Payment Status</span>
              <span class="read-value">
                <span :class="['status-badge', paymentBadgeClass(activeOrder.paymentStatus)]">
                  {{ activeOrder.paymentStatus }}
                </span>
                <span class="method-text"> via {{ activeOrder.paymentMethod === 'cash' ? 'Cash on Arrival' : 'Card' }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Panel 3: Items Breakdown -->
        <div class="details-section details-section--full shadow-section">
          <h3 class="details-section-title"><ShoppingBag class="section-icon" /> Curation Items List</h3>
          
          <div class="items-invoice-table-wrap">
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Seller Partner</th>
                  <th class="text-center">Price</th>
                  <th class="text-center">Qty</th>
                  <th class="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in activeOrder.items" :key="item.productId?._id">
                  <td>
                    <div class="invoice-product-cell">
                      <img v-if="item.image" :src="item.image" class="invoice-thumb" alt="Product" />
                      <span>{{ item.name }}</span>
                    </div>
                  </td>
                  <td>{{ item.productId?.seller?.fullName || 'CURIO Gallery' }}</td>
                  <td class="text-center">${{ item.price.toFixed(2) }}</td>
                  <td class="text-center">{{ item.quantity }}</td>
                  <td class="text-right font-mono">${{ (item.price * item.quantity).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Invoice Summary Totals -->
          <div class="invoice-totals-wrapper">
            <div class="totals-breakdown">
              <div class="totals-row">
                <span>Subtotal</span>
                <span>${{ activeOrder.totals.subtotal.toFixed(2) }}</span>
              </div>
              <div v-if="activeOrder.totals.discount > 0" class="totals-row totals-row--discount">
                <span>Discount ({{ activeOrder.promoCode || 'PROMO' }})</span>
                <span>-${{ activeOrder.totals.discount.toFixed(2) }}</span>
              </div>
              <div class="totals-row">
                <span>Shipping Costs</span>
                <span>${{ activeOrder.totals.shipping.toFixed(2) }}</span>
              </div>
              <div class="totals-row">
                <span>Registry Tax (10%)</span>
                <span>${{ activeOrder.totals.tax.toFixed(2) }}</span>
              </div>
              <div class="totals-row totals-row--grand">
                <span>Grand Total</span>
                <span>${{ activeOrder.totals.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="close-modal-btn" @click="closeModals">Close Receipt</button>
      </template>
    </BaseModal>

    <!-- Global Confirmation dialog overlay -->
    <BaseConfirmDialog
      v-model="showConfirmDialog"
      :title="confirmDialogTitle"
      :message="confirmDialogMessage"
      :variant="confirmDialogVariant"
      :loading="confirmDialogLoading"
      @confirm="handleConfirmAction"
      @cancel="handleConfirmCancel"
    />
  </div>
</template>

<style scoped>
.admin-orders-page {
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-primary);
  margin: 0 0 6px 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--color-muted);
  margin: 0;
}

/* Controls Toolbar */
.controls-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-input-wrap {
  position: relative;
  flex: 1;
  max-width: 450px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--color-muted);
  pointer-events: none;
}

.search-input-box {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  background-color: var(--color-surface);
  color: var(--color-text);
  box-sizing: border-box;
}

.search-input-box:focus {
  outline: none;
  border-color: var(--color-accent);
}

.filter-select-wrap {
  min-width: 200px;
}

/* Table formats */
.order-id-label {
  font-family: var(--font-mono, monospace);
  font-weight: 700;
  color: var(--color-primary);
}

.customer-info-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.customer-name {
  font-weight: 600;
  color: var(--color-text);
}

.customer-email {
  font-size: 0.8rem;
  color: var(--color-muted);
}

.sellers-text {
  font-weight: 600;
  max-width: 250px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.payment-info-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.payment-method-desc {
  font-size: 0.72rem;
  color: var(--color-muted);
  font-weight: 600;
}

.date-cell {
  color: var(--color-muted);
}

/* Status badges */
.status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  text-transform: capitalize;
  display: inline-block;
}

.badge-pending {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.badge-confirmed {
  background-color: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.badge-processing {
  background-color: rgba(30, 41, 59, 0.1);
  color: #1e293b;
}

.badge-shipped {
  background-color: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
}

.badge-delivered {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.badge-cancelled {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.badge-paid {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.badge-failed {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Actions list */
.actions-buttons {
  display: inline-flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  background: none;
  border: 1px solid var(--color-border);
  padding: 6px;
  border-radius: var(--radius-md);
  color: var(--color-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: var(--color-bg-alt);
  color: var(--color-text);
  border-color: var(--color-muted);
}

.action-confirm:hover {
  border-color: #6366f1;
  color: #6366f1;
  background-color: rgba(99, 102, 241, 0.05);
}

.action-process:hover {
  border-color: #1e293b;
  color: #1e293b;
  background-color: rgba(30, 41, 59, 0.05);
}

.action-ship:hover {
  border-color: #0ea5e9;
  color: #0ea5e9;
  background-color: rgba(14, 165, 233, 0.05);
}

.action-deliver:hover {
  border-color: #10b981;
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.05);
}

.action-cancel:hover {
  border-color: #ef4444;
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}

.action-icon {
  width: 14px;
  height: 14px;
}

/* Error Banner */
.error-banner {
  text-align: center;
  padding: 80px 24px;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: #ef4444;
  margin-bottom: 16px;
}

.error-banner h3 {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 8px 0;
}

.error-banner p {
  font-family: var(--font-sans);
  color: var(--color-muted);
  margin: 0 0 24px 0;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.retry-btn:hover {
  opacity: 0.9;
}

/* Details Modal Receipt layout */
.details-modal-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.details-section {
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-sizing: border-box;
}

.shadow-section {
  box-shadow: var(--shadow-soft);
}

.details-section--full {
  grid-column: span 2;
}

.details-section-title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 20px 0;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 10px;
}

.section-icon {
  width: 18px;
  height: 18px;
  color: var(--color-accent);
}

.details-read-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  text-align: left;
}

.read-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.read-group--full {
  grid-column: span 2;
}

.read-label {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.read-value {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.4;
}

.read-value.mono {
  font-family: var(--font-mono, monospace);
  font-size: 0.78rem;
}

.method-text {
  font-size: 0.8rem;
  color: var(--color-muted);
}

/* Invoice list */
.items-invoice-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.invoice-table th {
  padding: 10px 12px;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-muted);
  text-transform: uppercase;
  border-bottom: 2px solid var(--color-border);
}

.invoice-table td {
  padding: 12px;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}

.invoice-product-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.invoice-thumb {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  border: 1px solid var(--color-border);
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.font-mono {
  font-family: var(--font-mono, monospace);
}

/* Totals panel */
.invoice-totals-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.totals-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 280px;
}

.totals-row {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-sans);
  font-size: 0.88rem;
  color: var(--color-muted);
}

.totals-row--discount {
  color: #10b981;
}

.totals-row--grand {
  border-top: 2px dashed var(--color-border);
  padding-top: 10px;
  margin-top: 4px;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--color-primary);
}

.totals-row--grand span:last-child {
  font-size: 1.15rem;
  color: var(--color-accent);
  font-family: var(--font-mono, monospace);
}

.close-modal-btn {
  padding: 10px 18px;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  box-sizing: border-box;
}

.close-modal-btn:hover {
  background-color: var(--color-bg-alt);
}

@media (max-width: 768px) {
  .details-modal-grid {
    grid-template-columns: 1fr;
  }
  .details-section {
    grid-column: span 1;
  }
}
</style>

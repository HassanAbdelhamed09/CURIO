<script setup lang="ts">

import { ref, onMounted, computed } from 'vue';
import { Bar, Line, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  Users,
  Briefcase,
  Package,
  ShoppingBag,
  DollarSign,
  RefreshCw,
  AlertTriangle,
} from '@lucide/vue';
import { adminApi } from '../../../api/admin.api.js';
import type {
  DashboardStats,
  DashboardCharts,
  DashboardRecent,
} from '../../../api/admin.api.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const loading = ref(true);
const error = ref<string | null>(null);

const stats = ref<DashboardStats>({
  customers: 0,
  sellers: 0,
  products: 0,
  orders: 0,
  revenue: 0,
});

const charts = ref<DashboardCharts>({
  salesPerMonth: [],
  ordersPerMonth: [],
  productsPerCategory: [],
});

const recent = ref<DashboardRecent>({
  orders: [],
  sellers: [],
  products: [],
});

const fetchDashboard = async (): Promise<void> => {
  loading.value = true;
  error.value = null;
  try {
    const response = await adminApi.fetchDashboardData();
    if (!response.data) {
      throw new Error('No dashboard data received.');
    }
    const data = response.data;
    stats.value = data.stats;
    charts.value = data.charts;
    recent.value = data.recent;
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to load dashboard data.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboard();
});

// Chart configurations
const salesChartData = computed(() => ({
  labels: charts.value.salesPerMonth.map((d) => `${d.month} ${d.year}`),
  datasets: [
    {
      label: 'Revenue ($)',
      data: charts.value.salesPerMonth.map((d) => d.value),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6366f1',
      pointRadius: 4,
    },
  ],
}));

const ordersChartData = computed(() => ({
  labels: charts.value.ordersPerMonth.map((d) => `${d.month} ${d.year}`),
  datasets: [
    {
      label: 'Orders',
      data: charts.value.ordersPerMonth.map((d) => d.value),
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderRadius: 6,
    },
  ],
}));

const categoryChartData = computed(() => ({
  labels: charts.value.productsPerCategory.map((d) => d.category),
  datasets: [
    {
      data: charts.value.productsPerCategory.map((d) => d.count),
      backgroundColor: [
        '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16',
      ],
      borderWidth: 0,
    },
  ],
}));

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true },
  },
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const, labels: { padding: 16, usePointStyle: true } },
  },
};

const statCards = computed(() => [
  { label: 'Customers', value: stats.value.customers, icon: Users, color: '#6366f1' },
  { label: 'Sellers', value: stats.value.sellers, icon: Briefcase, color: '#10b981' },
  { label: 'Products', value: stats.value.products, icon: Package, color: '#f59e0b' },
  { label: 'Orders', value: stats.value.orders, icon: ShoppingBag, color: '#8b5cf6' },
  { label: 'Revenue', value: `$${stats.value.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: '#ef4444' },
]);

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const statusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: '#f59e0b',
    processing: '#6366f1',
    shipped: '#3b82f6',
    delivered: '#10b981',
    cancelled: '#ef4444',
    active: '#10b981',
    draft: '#a3aab8',
    archived: '#ef4444',
  };
  return colors[status] || '#a3aab8';
};
</script>

<template>
  <div class="admin-dashboard-page">
    <!-- Error Boundary -->
    <div v-if="error" class="error-boundary">
      <AlertTriangle class="error-icon" />
      <h3>Something went wrong</h3>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchDashboard">
        <RefreshCw class="retry-icon" /> Retry
      </button>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="loading-skeleton">
      <div class="skeleton-cards">
        <div v-for="i in 5" :key="i" class="skeleton-card"></div>
      </div>
      <div class="skeleton-charts">
        <div class="skeleton-chart"></div>
        <div class="skeleton-chart"></div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <template v-else>
      <!-- Page Header -->
      <header class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Welcome back. Here's your platform overview.</p>
        </div>
      </header>

      <!-- Statistics Cards -->
      <section class="stats-grid">
        <div
          v-for="card in statCards"
          :key="card.label"
          class="stat-card"
        >
          <div class="stat-icon-wrap" :style="{ backgroundColor: card.color + '15' }">
            <component :is="card.icon" class="stat-icon" :style="{ color: card.color }" />
          </div>
          <div class="stat-info">
            <span class="stat-label">{{ card.label }}</span>
            <span class="stat-value">{{ card.value }}</span>
          </div>
        </div>
      </section>

      <!-- Charts Section -->
      <section class="charts-grid">
        <div class="chart-card chart-wide">
          <h3 class="chart-title">Sales per Month</h3>
          <div class="chart-canvas-wrap">
            <Line :data="salesChartData" :options="lineChartOptions" />
          </div>
        </div>
        <div class="chart-card">
          <h3 class="chart-title">Orders per Month</h3>
          <div class="chart-canvas-wrap">
            <Bar :data="ordersChartData" :options="barChartOptions" />
          </div>
        </div>
        <div class="chart-card">
          <h3 class="chart-title">Products per Category</h3>
          <div class="chart-canvas-wrap">
            <Doughnut :data="categoryChartData" :options="doughnutOptions" />
          </div>
        </div>
      </section>

      <!-- Recent Activity Tables -->
      <section class="tables-grid">
        <!-- Latest Orders -->
        <div class="table-card">
          <h3 class="table-title">Latest Orders</h3>
          <div class="table-scroll">
            <table v-if="recent.orders.length">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recent.orders" :key="order._id">
                  <td>{{ order.customerName }}</td>
                  <td class="mono">${{ order.total.toFixed(2) }}</td>
                  <td>
                    <span class="status-badge" :style="{ color: statusColor(order.status), backgroundColor: statusColor(order.status) + '15' }">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="date-cell">{{ formatDate(order.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else class="empty-msg">No recent orders.</p>
          </div>
        </div>

        <!-- Latest Sellers -->
        <div class="table-card">
          <h3 class="table-title">Latest Sellers</h3>
          <div class="table-scroll">
            <table v-if="recent.sellers.length">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="seller in recent.sellers" :key="seller._id">
                  <td>{{ seller.fullName }}</td>
                  <td class="email-cell">{{ seller.email }}</td>
                  <td class="date-cell">{{ formatDate(seller.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else class="empty-msg">No recent sellers.</p>
          </div>
        </div>

        <!-- Latest Products -->
        <div class="table-card">
          <h3 class="table-title">Latest Products</h3>
          <div class="table-scroll">
            <table v-if="recent.products.length">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in recent.products" :key="product._id">
                  <td>{{ product.name }}</td>
                  <td class="mono">${{ product.price.toFixed(2) }}</td>
                  <td>
                    <span class="status-badge" :style="{ color: statusColor(product.status), backgroundColor: statusColor(product.status) + '15' }">
                      {{ product.status }}
                    </span>
                  </td>
                  <td class="date-cell">{{ formatDate(product.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else class="empty-msg">No recent products.</p>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.admin-dashboard-page {
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

/* Statistics Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon {
  width: 22px;
  height: 22px;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stat-value {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text);
}

/* Charts */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.chart-wide {
  grid-column: 1 / -1;
}

.chart-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.chart-title {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 20px 0;
}

.chart-canvas-wrap {
  position: relative;
  height: 280px;
}

/* Tables */
.tables-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.table-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.table-title {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 16px 0;
}

.table-scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-sans);
  font-size: 0.85rem;
}

thead th {
  text-align: left;
  padding: 10px 12px;
  font-weight: 700;
  color: var(--color-muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--color-border);
}

tbody td {
  padding: 10px 12px;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

tbody tr:last-child td {
  border-bottom: none;
}

.mono {
  font-family: var(--font-mono, monospace);
  font-weight: 600;
}

.email-cell {
  color: var(--color-muted);
  font-size: 0.8rem;
}

.date-cell {
  color: var(--color-muted);
  font-size: 0.8rem;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  text-transform: capitalize;
  display: inline-block;
}

.empty-msg {
  text-align: center;
  color: var(--color-muted);
  font-size: 0.9rem;
  padding: 24px 0;
  margin: 0;
}

/* Error Boundary */
.error-boundary {
  text-align: center;
  padding: 80px 24px;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: #ef4444;
  margin-bottom: 16px;
}

.error-boundary h3 {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 8px 0;
}

.error-boundary p {
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

.retry-icon {
  width: 16px;
  height: 16px;
}

/* Loading Skeleton */
.loading-skeleton {
  padding: 32px 0;
}

.skeleton-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.skeleton-card {
  height: 96px;
  background: linear-gradient(90deg, var(--color-border) 25%, var(--color-bg-alt) 50%, var(--color-border) 75%);
  background-size: 200% 100%;
  border-radius: var(--radius-lg);
  animation: shimmer 1.5s infinite;
}

.skeleton-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.skeleton-chart {
  height: 320px;
  background: linear-gradient(90deg, var(--color-border) 25%, var(--color-bg-alt) 50%, var(--color-border) 75%);
  background-size: 200% 100%;
  border-radius: var(--radius-lg);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Responsive */
@media (max-width: 1680px) {
  .tables-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .tables-grid > .table-card:last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .tables-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .tables-grid > .table-card:last-child {
    grid-column: auto;
  }
}

@media (max-width: 768px) {
  .admin-dashboard-page {
    padding: 20px 16px;
  }
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .charts-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .skeleton-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .skeleton-charts {
    grid-template-columns: minmax(0, 1fr);
  }
  .page-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>

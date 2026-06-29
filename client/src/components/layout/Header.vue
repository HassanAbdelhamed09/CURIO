<script setup lang="ts">

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store.js';
import { useToastStore } from '../../stores/toast.store.js';
import { Bell, Search, LogOut, Menu, User, ChevronDown } from '@lucide/vue';

interface Props {
  isAdmin?: boolean;
}

withDefaults(defineProps<Props>(), {
  isAdmin: false,
});

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void;
}>();

const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

const showProfileMenu = ref(false);
const showNotifications = ref(false);

const mockNotifications = ref([
  { id: 1, message: 'New order received from client.', time: '5m ago' },
  { id: 2, message: 'Seller application review completed.', time: '2h ago' },
  { id: 3, message: 'Stock alert: Product "Acoustic Guitar" is low.', time: '1d ago' },
]);

const handleLogout = async () => {
  try {
    await authStore.logout();
    toastStore.success('Successfully logged out.');
    router.replace('/auth/login');
  } catch (err: any) {
    toastStore.error('Logout failed.');
  }
};
</script>

<template>
  <header class="dashboard-header-bar">
    <div class="header-left">
      <button 
        class="menu-hamburger-btn" 
        @click="emit('toggle-sidebar')" 
        aria-label="Toggle Sidebar Menu"
      >
        <Menu class="icon-hamburger" />
      </button>

      <div v-if="isAdmin" class="search-input-wrapper">
        <Search class="icon-search" />
        <input 
          type="text" 
          placeholder="Search collections..." 
          class="header-search-bar" 
        />
      </div>
    </div>

    <div class="header-right">
      <!-- Notifications dropdown overlay panel -->
      <div class="header-control-wrapper">
        <button 
          class="header-action-btn" 
          @click="showNotifications = !showNotifications; showProfileMenu = false"
          aria-label="View Notifications"
        >
          <Bell class="icon-bell" />
          <span class="badge-dot"></span>
        </button>

        <div v-if="showNotifications" class="dropdown-panel notifications-panel">
          <header class="panel-header">
            <h4>Notifications</h4>
          </header>
          <ul class="notification-list">
            <li v-for="item in mockNotifications" :key="item.id">
              <p class="notification-msg">{{ item.message }}</p>
              <span class="notification-time">{{ item.time }}</span>
            </li>
          </ul>
          <footer class="panel-footer">
            <button class="clear-btn" @click="showNotifications = false">Close Panel</button>
          </footer>
        </div>
      </div>

      <!-- Profile dropdown menu -->
      <div class="header-control-wrapper">
        <button 
          class="profile-trigger-btn" 
          @click="showProfileMenu = !showProfileMenu; showNotifications = false"
        >
          <div class="avatar-circle">
            <span v-if="authStore.user?.fullName">{{ authStore.user.fullName[0].toUpperCase() }}</span>
            <User v-else class="icon-avatar-fallback" />
          </div>
          <span class="user-fullname">{{ authStore.user?.fullName || 'Curator' }}</span>
          <ChevronDown class="icon-dropdown" />
        </button>

        <div v-if="showProfileMenu" class="dropdown-panel profile-menu-panel">
          <div class="user-profile-summary">
            <p class="summary-name">{{ authStore.user?.fullName }}</p>
            <p class="summary-role">{{ authStore.user?.role.toUpperCase() }}</p>
          </div>
          <hr class="divider" />
          <button class="dropdown-link-btn" @click="handleLogout">
            <LogOut class="icon-logout" /> Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.dashboard-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 0 24px;
  box-sizing: border-box;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-hamburger-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  display: none;
  padding: 8px;
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
}

.menu-hamburger-btn:hover {
  background-color: var(--color-bg-alt);
}

.icon-hamburger {
  width: 24px;
  height: 24px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.icon-search {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: var(--color-text-light);
}

.header-search-bar {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 10px 16px 10px 36px;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--color-text);
  width: 260px;
  box-sizing: border-box;
  transition: all 0.2s;
}

.header-search-bar:focus {
  outline: none;
  border-color: var(--color-primary);
  background-color: var(--color-surface);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-control-wrapper {
  position: relative;
}

.header-action-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  padding: 10px;
  border-radius: var(--radius-full);
  transition: background-color 0.2s;
}

.header-action-btn:hover {
  background-color: var(--color-bg-alt);
}

.icon-bell {
  width: 20px;
  height: 20px;
}

.badge-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-danger, #ef4444);
}

.profile-trigger-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  transition: background-color 0.2s;
}

.profile-trigger-btn:hover {
  background-color: var(--color-bg-alt);
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.icon-avatar-fallback {
  width: 18px;
  height: 18px;
}

.user-fullname {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 600;
}

.icon-dropdown {
  width: 16px;
  height: 16px;
  color: var(--color-text-light);
}

/* Dropdown Panel */
.dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  z-index: 100;
  overflow: hidden;
  box-sizing: border-box;
}

.notifications-panel {
  width: 320px;
}

.panel-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
}

.panel-header h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text);
}

.notification-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 240px;
  overflow-y: auto;
}

.notification-list li {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}

.notification-list li:last-child {
  border-bottom: none;
}

.notification-msg {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--color-text);
  margin: 0 0 4px 0;
  line-height: 1.4;
  text-align: left;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.panel-footer {
  padding: 8px 16px;
  background-color: var(--color-bg-alt);
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.clear-btn {
  background: none;
  border: none;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--color-text-light);
  font-weight: 600;
  cursor: pointer;
}

.clear-btn:hover {
  color: var(--color-primary);
}

.profile-menu-panel {
  width: 220px;
  padding: 12px 0;
}

.user-profile-summary {
  padding: 8px 16px;
  text-align: left;
}

.summary-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--color-text);
  margin: 0 0 2px 0;
}

.summary-role {
  font-size: 0.75rem;
  color: var(--color-accent);
  font-weight: 700;
  letter-spacing: 0.05em;
  margin: 0;
}

.divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 10px 0;
}

.dropdown-link-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  padding: 10px 16px;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--color-text);
  cursor: pointer;
  box-sizing: border-box;
}

.dropdown-link-btn:hover {
  background-color: var(--color-bg-alt);
  color: var(--color-primary);
}

.icon-logout {
  width: 16px;
  height: 16px;
}

@media (max-width: 1023px) {
  .menu-hamburger-btn {
    display: block;
  }
}
</style>

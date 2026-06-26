<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../../../stores/user.store.js';
import { useAuthStore } from '../../../stores/auth.store.js';
import { useRouter } from 'vue-router';
import UserAvatar from '../../../components/shared/UserAvatar.vue';
import BaseLoader from '../../../components/ui/BaseLoader.vue';
import BaseAlert from '../../../components/ui/BaseAlert.vue';
import BaseButton from '../../../components/ui/BaseButton.vue';

const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      await userStore.fetchProfile();
    } catch (err) {
      console.error('Failed to load profile dashboard', err);
    }
  }
});

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'login' });
};
</script>

<template>
  <div class="profile-dashboard">
    <header class="dashboard-header">
      <span class="dashboard-eyebrow">PORTAL // REGISTRY DIRECTORY</span>
      <h1 class="dashboard-title">Collector Portal</h1>
      <p class="dashboard-subtitle">Review your secure registry, membership status, and archive metrics.</p>
    </header>

    <BaseLoader v-if="userStore.loading" text="Retrieving registry credentials..." />
    <BaseAlert v-else-if="userStore.error" type="error" :message="userStore.error" />

    <div v-else-if="userStore.profile" class="dashboard-grid">
      <!-- 1. Profile Summary Card -->
      <section class="summary-card" aria-label="Profile Summary">
        <div class="avatar-container">
          <div class="avatar-frame">
            <UserAvatar
              :avatarUrl="userStore.profile.avatarUrl"
              :fullName="userStore.profile.fullName"
              size="lg"
            />
          </div>
        </div>
        
        <div class="meta-container">
          <span class="member-serial">MEMBER ID // AE-{{ userStore.profile.id ? userStore.profile.id.substring(0, 8).toUpperCase() : 'MEMBER' }}</span>
          <h2 class="user-name">{{ userStore.profile.fullName }}</h2>
          <div class="badges-row">
            <span :class="['badge', `badge-${userStore.profile.role}`]">
              {{ userStore.profile.role === 'customer' ? 'Collector' : userStore.profile.role }}
            </span>
            <span :class="['badge', `badge-${userStore.profile.status}`]">
              {{ userStore.profile.status }}
            </span>
          </div>
        </div>
      </section>

      <!-- 2. Detailed Profile Fields -->
      <section class="details-section" aria-label="Account Information">
        <h3 class="section-heading">Archive Credentials</h3>
        
        <div class="details-grid">
          <!-- Email Field -->
          <div class="detail-field">
            <span class="field-label">Registry Email</span>
            <div class="field-value-row">
              <span class="field-value">{{ userStore.profile.email || 'Not provided' }}</span>
              <span
                v-if="userStore.profile.email"
                :class="['status-pill', userStore.profile.emailVerified ? 'pill-verified' : 'pill-unverified']"
              >
                {{ userStore.profile.emailVerified ? 'AUTHENTICATED' : 'UNVERIFIED' }}
              </span>
            </div>
          </div>

          <!-- Phone Field -->
          <div class="detail-field">
            <span class="field-label">Secure Phone</span>
            <div class="field-value-row">
              <span class="field-value">{{ userStore.profile.phone || 'Not provided' }}</span>
              <span
                v-if="userStore.profile.phone"
                :class="['status-pill', userStore.profile.phoneVerified ? 'pill-verified' : 'pill-unverified']"
              >
                {{ userStore.profile.phoneVerified ? 'AUTHENTICATED' : 'UNVERIFIED' }}
              </span>
            </div>
          </div>

          <!-- Login Details -->
          <div class="detail-field">
            <span class="field-label">Handshake Protocol</span>
            <span class="field-value capitalize">{{ userStore.profile.provider }}</span>
          </div>

          <div v-if="userStore.profile.lastLoginAt" class="detail-field">
            <span class="field-label">Last Successful Handshake</span>
            <span class="field-value monospace-val">
              {{ new Date(userStore.profile.lastLoginAt).toLocaleString() }}
            </span>
          </div>
        </div>

        <!-- Dashboard Controls -->
        <footer class="details-footer">
          <router-link to="/profile/edit" class="edit-link">
            <BaseButton variant="primary">Edit Registry</BaseButton>
          </router-link>
          
          <BaseButton variant="secondary" @click="handleLogout" class="btn-dashboard-logout">
            Terminate Session
          </BaseButton>
        </footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
.profile-dashboard {
  max-width: 850px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 40px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 24px;
}

.dashboard-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--color-primary);
  display: block;
  margin-bottom: 8px;
}

.dashboard-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 400;
  color: var(--color-text-h);
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.dashboard-subtitle {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--color-text);
  margin: 0;
}

.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Summary Card Style (Brutalist Curation Frame) */
.summary-card {
  display: flex;
  align-items: center;
  gap: 32px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 32px;
  box-shadow: var(--shadow-soft);
  box-sizing: border-box;
  position: relative;
}

.summary-card::before {
  content: '+';
  position: absolute;
  top: -9px;
  left: -5px;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--color-primary);
  opacity: 0.6;
}

.avatar-container {
  flex-shrink: 0;
}

.avatar-frame {
  border: 1px solid var(--color-primary);
  padding: 6px;
  display: inline-flex;
}

.meta-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.member-serial {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--color-primary);
}

.user-name {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 400;
  color: var(--color-text-h);
  line-height: 1.1;
}

.badges-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 4px 12px;
  border: 1px solid transparent;
}

/* Badges coloring */
.badge-customer {
  border-color: rgba(197, 168, 128, 0.3);
  background-color: rgba(197, 168, 128, 0.05);
  color: var(--color-primary);
}
.badge-seller {
  border-color: rgba(143, 92, 56, 0.3);
  background-color: rgba(143, 92, 56, 0.05);
  color: var(--color-accent-light);
}
.badge-admin {
  border-color: rgba(239, 68, 68, 0.3);
  background-color: rgba(239, 68, 68, 0.05);
  color: var(--color-error);
}
.badge-active {
  border-color: rgba(16, 185, 129, 0.3);
  background-color: rgba(16, 185, 129, 0.05);
  color: var(--color-success);
}
.badge-blocked {
  border-color: rgba(239, 68, 68, 0.5);
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

/* Details Section Style */
.details-section {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 40px;
  box-shadow: var(--shadow-soft);
  box-sizing: border-box;
  text-align: left;
}

.section-heading {
  margin: 0 0 32px 0;
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 400;
  color: var(--color-text-h);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 12px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 32px;
  margin-bottom: 32px;
}

.detail-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.field-value {
  font-family: var(--font-sans);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--color-text-h);
}

.monospace-val {
  font-family: var(--font-mono) !important;
  font-size: 0.9rem;
}

.field-value-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.status-pill {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 500;
  padding: 2px 8px;
  border: 1px solid transparent;
  letter-spacing: 0.05em;
}

.pill-verified {
  border-color: rgba(16, 185, 129, 0.3);
  color: var(--color-success);
  background-color: rgba(16, 185, 129, 0.05);
}
.pill-unverified {
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--color-error);
  background-color: rgba(239, 68, 68, 0.05);
}

.capitalize {
  text-transform: capitalize;
}

.details-footer {
  display: flex;
  gap: 20px;
}

.edit-link {
  text-decoration: none;
}

@media (max-width: 640px) {
  .summary-card {
    flex-direction: column;
    text-align: center;
    padding: 24px 16px;
  }
  .meta-container {
    text-align: center;
    align-items: center;
  }
  .details-section {
    padding: 24px 16px;
  }
  .details-footer {
    flex-direction: column;
  }
  .edit-link, .btn-dashboard-logout {
    width: 100%;
  }
}
</style>

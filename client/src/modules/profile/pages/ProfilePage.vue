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
      <h1 class="dashboard-title">Account Dashboard</h1>
      <p class="dashboard-subtitle">Manage your profile details and settings</p>
    </header>

    <BaseLoader v-if="userStore.loading" text="Loading your account details..." />
    <BaseAlert v-else-if="userStore.error" type="error" :message="userStore.error" />

    <div v-else-if="userStore.profile" class="dashboard-grid">
      <!-- 1. Profile Summary Card -->
      <section class="summary-card" aria-label="Profile Summary">
        <div class="avatar-container">
          <UserAvatar
            :avatarUrl="userStore.profile.avatarUrl"
            :fullName="userStore.profile.fullName"
            size="lg"
          />
        </div>
        
        <div class="meta-container">
          <h2 class="user-name">{{ userStore.profile.fullName }}</h2>
          <div class="badges-row">
            <span :class="['badge', `badge-${userStore.profile.role}`]">
              {{ userStore.profile.role }}
            </span>
            <span :class="['badge', `badge-${userStore.profile.status}`]">
              {{ userStore.profile.status }}
            </span>
          </div>
        </div>
      </section>

      <!-- 2. Detailed Profile Fields -->
      <section class="details-section" aria-label="Account Information">
        <h3 class="section-heading">Account Details</h3>
        
        <div class="details-grid">
          <!-- Email Field -->
          <div class="detail-field">
            <span class="field-label">Email Address</span>
            <div class="field-value-row">
              <span class="field-value">{{ userStore.profile.email || 'Not provided' }}</span>
              <span
                v-if="userStore.profile.email"
                :class="['status-pill', userStore.profile.emailVerified ? 'pill-verified' : 'pill-unverified']"
              >
                {{ userStore.profile.emailVerified ? 'Verified' : 'Unverified' }}
              </span>
            </div>
          </div>

          <!-- Phone Field -->
          <div class="detail-field">
            <span class="field-label">Phone Number</span>
            <div class="field-value-row">
              <span class="field-value">{{ userStore.profile.phone || 'Not provided' }}</span>
              <span
                v-if="userStore.profile.phone"
                :class="['status-pill', userStore.profile.phoneVerified ? 'pill-verified' : 'pill-unverified']"
              >
                {{ userStore.profile.phoneVerified ? 'Verified' : 'Unverified' }}
              </span>
            </div>
          </div>

          <!-- Login Details -->
          <div class="detail-field">
            <span class="field-label">Authentication Method</span>
            <span class="field-value capitalize">{{ userStore.profile.provider }}</span>
          </div>

          <div v-if="userStore.profile.lastLoginAt" class="detail-field">
            <span class="field-label">Last Login Timestamp</span>
            <span class="field-value">
              {{ new Date(userStore.profile.lastLoginAt).toLocaleString() }}
            </span>
          </div>
        </div>

        <!-- Dashboard Controls -->
        <footer class="details-footer">
          <router-link to="/profile/edit" class="edit-link">
            <BaseButton variant="primary">Edit Profile</BaseButton>
          </router-link>
          
          <BaseButton variant="secondary" @click="handleLogout" class="btn-dashboard-logout">
            Logout
          </BaseButton>
        </footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
.profile-dashboard {
  max-width: 800px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 32px;
  text-align: left;
}

.dashboard-title {
  font-family: var(--font-heading);
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--color-text-h);
  margin: 0 0 6px 0;
  letter-spacing: -0.75px;
}

.dashboard-subtitle {
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-muted);
  margin: 0;
}

.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Summary Card Style */
.summary-card {
  display: flex;
  align-items: center;
  gap: 24px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-soft);
  box-sizing: border-box;
}

.avatar-container {
  flex-shrink: 0;
}

.meta-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.user-name {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-text-h);
}

.badges-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 10px;
  border-radius: 9999px;
}

/* Badges coloring */
.badge-customer {
  background-color: rgba(15, 61, 94, 0.08);
  color: var(--color-primary);
}
.badge-seller {
  background-color: rgba(245, 158, 11, 0.1);
  color: #92400e;
}
.badge-admin {
  background-color: rgba(239, 68, 68, 0.08);
  color: var(--color-error);
}
.badge-active {
  background-color: rgba(16, 185, 129, 0.08);
  color: var(--color-success);
}
.badge-blocked {
  background-color: rgba(239, 68, 68, 0.08);
  color: var(--color-error);
}

/* Details Section Style */
.details-section {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow-soft);
  box-sizing: border-box;
  text-align: left;
}

.section-heading {
  margin: 0 0 24px 0;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-h);
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 28px;
  margin-bottom: 28px;
}

.detail-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-family: var(--font-sans);
  font-size: 0.825rem;
  font-weight: 600;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-value {
  font-family: var(--font-sans);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text-h);
}

.field-value-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.status-pill {
  font-family: var(--font-sans);
  font-size: 0.725rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}

.pill-verified {
  background-color: rgba(16, 185, 129, 0.08);
  color: var(--color-success);
}
.pill-unverified {
  background-color: rgba(239, 68, 68, 0.08);
  color: var(--color-error);
}

.capitalize {
  text-transform: capitalize;
}

.details-footer {
  display: flex;
  gap: 16px;
}

.edit-link {
  text-decoration: none;
}

@media (max-width: 640px) {
  .summary-card {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }
  .meta-container {
    text-align: center;
    align-items: center;
  }
  .details-section {
    padding: 20px;
  }
  .details-footer {
    flex-direction: column;
  }
  .edit-link, .btn-dashboard-logout {
    width: 100%;
  }
}
</style>

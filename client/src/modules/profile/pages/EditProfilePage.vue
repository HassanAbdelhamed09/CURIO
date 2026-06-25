<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../stores/user.store.js';
import ProfileForm from '../components/ProfileForm.vue';
import AvatarUploader from '../components/AvatarUploader.vue';

const userStore = useUserStore();
const router = useRouter();

const handleSuccess = () => {
  router.push({ name: 'profile' });
};

const handleCancel = () => {
  router.push({ name: 'profile' });
};

const handleAvatarUpload = async (file: File) => {
  try {
    await userStore.uploadAvatar(file);
  } catch (err) {
    console.error('Failed uploading avatar image', err);
  }
};
</script>

<template>
  <div class="edit-profile-view">
    <header class="page-header">
      <h1 class="page-title">Edit Account Profile</h1>
      <p class="page-subtitle">Customize your public presence and account details</p>
    </header>

    <div v-if="userStore.profile" class="edit-layout">
      <!-- Left Column: Avatar Uploader -->
      <section class="card-column" aria-label="Customize Avatar">
        <div class="card-panel">
          <h3 class="panel-heading">Profile Picture</h3>
          <AvatarUploader
            :avatarUrl="userStore.profile.avatarUrl"
            :fullName="userStore.profile.fullName"
            @upload="handleAvatarUpload"
          />
        </div>
      </section>

      <!-- Right Column: Form Inputs -->
      <section class="card-column" aria-label="Account Settings">
        <div class="card-panel">
          <h3 class="panel-heading">Personal Information</h3>
          <ProfileForm
            @success="handleSuccess"
            @cancel="handleCancel"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.edit-profile-view {
  max-width: 900px;
  margin: 0 auto;
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

.edit-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  align-items: start;
}

.card-panel {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-soft);
  box-sizing: border-box;
  text-align: left;
}

.panel-heading {
  margin: 0 0 20px 0;
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text-h);
}

@media (max-width: 768px) {
  .edit-layout {
    grid-template-columns: 1fr;
  }
}
</style>

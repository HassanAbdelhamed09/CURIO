<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../../stores/user.store.js';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseButton from '../../../components/ui/BaseButton.vue';
import BaseAlert from '../../../components/ui/BaseAlert.vue';

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();

const userStore = useUserStore();

const fullName = ref('');
const phone = ref('');
const nameError = ref('');

onMounted(async () => {
  if (!userStore.profile) {
    try {
      await userStore.fetchProfile();
    } catch (err) {
      console.error(err);
    }
  }

  if (userStore.profile) {
    fullName.value = userStore.profile.fullName;
    phone.value = userStore.profile.phone || '';
  }
});

const validateForm = (): boolean => {
  if (!fullName.value.trim()) {
    nameError.value = 'Full name is required.';
    return false;
  }
  nameError.value = '';
  return true;
};

const handleSaveSubmit = async () => {
  if (!validateForm()) return;

  try {
    await userStore.updateProfile({
      fullName: fullName.value,
      phone: phone.value,
    });
    emit('success');
  } catch (err) {
    console.error('Profile form submission error', err);
  }
};
</script>

<template>
  <div class="profile-form-container">
    <BaseAlert
      v-if="userStore.error"
      type="error"
      :message="userStore.error"
      closable
    />

    <form @submit.prevent="handleSaveSubmit" novalidate class="form-layout">
      <!-- Full Name Field -->
      <BaseInput
        id="edit-fullName"
        v-model="fullName"
        type="text"
        label="Full Name"
        placeholder="Jane Doe"
        :error="nameError"
        required
        autocomplete="name"
      />

      <!-- Phone Number Field -->
      <BaseInput
        id="edit-phone"
        v-model="phone"
        type="tel"
        label="Phone Number"
        placeholder="+1 (555) 000-0000"
        autocomplete="tel"
      />

      <!-- Actions CTA -->
      <div class="form-actions">
        <BaseButton
          type="button"
          variant="secondary"
          @click="$emit('cancel')"
          :disabled="userStore.loading"
          class="btn-cancel"
        >
          Cancel
        </BaseButton>
        
        <BaseButton
          type="submit"
          :loading="userStore.loading"
          class="btn-submit"
        >
          Save Changes
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.profile-form-container {
  width: 100%;
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-actions {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
  margin-top: 16px;
}

.btn-cancel {
  width: 100%;
}

.btn-submit {
  width: 100%;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthCard from '../components/AuthCard.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseButton from '../../../components/ui/BaseButton.vue';
import BaseAlert from '../../../components/ui/BaseAlert.vue';

const password = ref('');
const confirmPassword = ref('');
const passwordError = ref('');
const confirmError = ref('');
const loading = ref(false);
const globalError = ref('');
const success = ref(false);
const router = useRouter();

const validateForm = () => {
  let isValid = true;

  if (!password.value) {
    passwordError.value = 'Password is required.';
    isValid = false;
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters.';
    isValid = false;
  } else {
    passwordError.value = '';
  }

  if (!confirmPassword.value) {
    confirmError.value = 'Please confirm your password.';
    isValid = false;
  } else if (password.value !== confirmPassword.value) {
    confirmError.value = 'Passwords do not match.';
    isValid = false;
  } else {
    confirmError.value = '';
  }

  return isValid;
};

const handleReset = () => {
  if (!validateForm()) return;

  globalError.value = '';
  loading.value = true;

  // Simulate resetting password
  setTimeout(() => {
    loading.value = false;
    success.value = true;
    setTimeout(() => {
      router.push({ name: 'login' });
    }, 2500);
  }, 1500);
};
</script>

<template>
  <div class="reset-password-view">
    <AuthCard>
      <header class="auth-header">
        <h1 class="auth-title">Reset Password</h1>
        <p class="auth-subtitle">Enter a new secure password for your account</p>
      </header>

      <BaseAlert v-if="globalError" type="error" :message="globalError" />
      
      <BaseAlert
        v-if="success"
        type="success"
        message="Password updated successfully! Redirecting you to login..."
      />

      <form v-if="!success" @submit.prevent="handleReset" novalidate class="form-layout">
        <!-- New Password Field -->
        <BaseInput
          id="new-password"
          v-model="password"
          type="password"
          label="New Password"
          placeholder="Minimum 8 characters"
          :error="passwordError"
          required
          autocomplete="new-password"
        />

        <!-- Confirm Password Field -->
        <BaseInput
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          :error="confirmError"
          required
          autocomplete="new-password"
        />

        <BaseButton
          type="submit"
          :loading="loading"
          fullWidth
          class="submit-cta"
        >
          Update Password
        </BaseButton>
      </form>
    </AuthCard>
  </div>
</template>

<style scoped>
.reset-password-view {
  width: 100%;
  display: flex;
  justify-content: center;
}

.auth-header {
  margin-bottom: 28px;
}

.auth-title {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-text-h);
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.auth-subtitle {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--color-muted);
  margin: 0;
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.submit-cta {
  margin-top: 12px;
}
</style>

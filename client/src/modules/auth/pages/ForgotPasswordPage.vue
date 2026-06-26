<script setup lang="ts">
import { ref } from 'vue';
import AuthCard from '../components/AuthCard.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseButton from '../../../components/ui/BaseButton.vue';
import BaseAlert from '../../../components/ui/BaseAlert.vue';
import { validateEmail } from '../../../utils/validation.js';
import { authApi } from '../../../api/auth.api.js';

const email = ref('');
const emailError = ref('');
const loading = ref(false);
const message = ref('');
const success = ref(false);

const validateForm = () => {
  if (!email.value) {
    emailError.value = 'Email address is required.';
    return false;
  }
  if (!validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email address.';
    return false;
  }
  emailError.value = '';
  return true;
};

const handleRequestReset = async () => {
  if (!validateForm()) return;

  loading.value = true;
  message.value = '';
  
  try {
    const response = await authApi.forgotPassword(email.value);
    loading.value = false;
    success.value = true;
    message.value = response.message || 'A secure password recovery link has been dispatched to your email address.';
  } catch (err: any) {
    loading.value = false;
    success.value = false;
    message.value = err.response?.data?.message || 'Failed to request password reset. Please try again.';
  }
};
</script>

<template>
  <div class="forgot-password-view">
    <AuthCard>
      <header class="auth-header">
        <h1 class="auth-title">Recover Password</h1>
        <p class="auth-subtitle">Enter your email and we'll send reset instructions</p>
      </header>

      <BaseAlert
        v-if="message"
        :type="success ? 'success' : 'error'"
        :message="message"
        class="forgot-alert"
      />

      <form v-if="!success" @submit.prevent="handleRequestReset" novalidate class="form-layout">
        <!-- Email Input -->
        <BaseInput
          id="recovery-email"
          v-model="email"
          type="email"
          label="Email Address"
          placeholder="name@example.com"
          :error="emailError"
          required
          autocomplete="email"
        />

        <!-- Submit -->
        <BaseButton
          type="submit"
          :loading="loading"
          fullWidth
          class="submit-cta"
        >
          Send Reset Link
        </BaseButton>
      </form>

      <!-- Back to Login Navigation -->
      <footer class="auth-footer">
        <router-link to="/auth/login" class="back-link">
          Back to Sign In
        </router-link>
      </footer>
    </AuthCard>
  </div>
</template>

<style scoped>
.forgot-password-view {
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

.forgot-alert {
  margin-bottom: 20px;
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.submit-cta {
  margin-top: 12px;
}

.auth-footer {
  margin-top: 28px;
  border-top: 1px solid var(--color-border);
  padding-top: 20px;
}

.back-link {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.back-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>

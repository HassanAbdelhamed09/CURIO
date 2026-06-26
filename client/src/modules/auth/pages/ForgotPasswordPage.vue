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
        <span class="auth-eyebrow">MEMBER PORTAL // SECURITY</span>
        <h1 class="auth-title">Recover Credentials</h1>
        <p class="auth-subtitle">Provide your registered email to request security key reset</p>
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
          Dispatch Recovery Key
        </BaseButton>
      </form>

      <!-- Back to Login Navigation -->
      <footer class="auth-footer">
        <router-link to="/auth/login" class="back-link">
          Return to Sign In
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
  margin-bottom: 32px;
  text-align: left;
}

.auth-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--color-primary);
  display: block;
  margin-bottom: 8px;
}

.auth-title {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  font-weight: 400;
  color: var(--color-text-h);
  margin: 0 0 8px 0;
  line-height: 1.15;
}

.auth-subtitle {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-text);
  margin: 0;
}

.forgot-alert {
  margin-bottom: 24px;
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
  margin-top: 32px;
  border-top: 1px solid var(--color-border);
  padding-top: 24px;
}

.back-link {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s;
  border-bottom: 1px solid transparent;
  display: inline-block;
}

.back-link:hover {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.back-link:focus-visible {
  outline: 1px solid var(--color-primary);
  outline-offset: 2px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../../stores/auth.store.js';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseButton from '../../../components/ui/BaseButton.vue';
import BaseAlert from '../../../components/ui/BaseAlert.vue';
import { validateEmail } from '../../../utils/validation.js';

const emit = defineEmits<{
  (e: 'success'): void;
}>();

const email = ref('');
const password = ref('');
const emailError = ref('');
const passwordError = ref('');

const authStore = useAuthStore();

const validateForm = (): boolean => {
  let isValid = true;

  if (!email.value) {
    emailError.value = 'Email address is required.';
    isValid = false;
  } else if (!validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email address.';
    isValid = false;
  } else {
    emailError.value = '';
  }

  if (!password.value) {
    passwordError.value = 'Password is required.';
    isValid = false;
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long.';
    isValid = false;
  } else {
    passwordError.value = '';
  }

  return isValid;
};

const handleLoginSubmit = async () => {
  if (!validateForm()) return;

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    emit('success');
  } catch (err) {
    console.error('Login form submission error', err);
  }
};
</script>

<template>
  <div class="login-form-container">
    <BaseAlert
      v-if="authStore.error"
      type="error"
      :message="authStore.error"
      closable
    />

    <form @submit.prevent="handleLoginSubmit" novalidate class="form-layout">
      <!-- Email Address Field -->
      <BaseInput
        id="login-email"
        v-model="email"
        type="email"
        label="Email Address"
        placeholder="name@example.com"
        :error="emailError"
        required
        autocomplete="email"
      />

      <!-- Password Field -->
      <BaseInput
        id="login-password"
        v-model="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        :error="passwordError"
        required
        autocomplete="current-password"
      />

      <div class="form-actions">
        <router-link to="/auth/forgot-password" class="forgot-link">
          Forgot password?
        </router-link>
      </div>

      <!-- Submit CTA -->
      <BaseButton
        type="submit"
        :loading="authStore.loading"
        fullWidth
      >
        Sign In
      </BaseButton>
    </form>
  </div>
</template>

<style scoped>
.login-form-container {
  width: 100%;
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.forgot-link {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: var(--color-accent);
}

.forgot-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>

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

const fullName = ref('');
const email = ref('');
const password = ref('');
const role = ref<'customer' | 'seller'>('customer');

const nameError = ref('');
const emailError = ref('');
const passwordError = ref('');

const authStore = useAuthStore();

const validateForm = (): boolean => {
  let isValid = true;

  if (!fullName.value.trim()) {
    nameError.value = 'Full name is required.';
    isValid = false;
  } else if (fullName.value.trim().length < 2) {
    nameError.value = 'Name must be at least 2 characters.';
    isValid = false;
  } else {
    nameError.value = '';
  }

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
    passwordError.value = 'Password must be at least 8 characters.';
    isValid = false;
  } else {
    passwordError.value = '';
  }

  return isValid;
};

const handleRegisterSubmit = async () => {
  if (!validateForm()) return;

  try {
    await authStore.register({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
      role: role.value,
    });
    emit('success');
  } catch (err) {
    console.error('Registration form submission error', err);
  }
};
</script>

<template>
  <div class="register-form-container">
    <BaseAlert
      v-if="authStore.error"
      type="error"
      :message="authStore.error"
      closable
    />

    <form @submit.prevent="handleRegisterSubmit" novalidate class="form-layout">
      <!-- Full Name Field -->
      <BaseInput
        id="register-name"
        v-model="fullName"
        type="text"
        label="Full Name"
        placeholder="Jane Doe"
        :error="nameError"
        required
        autocomplete="name"
      />

      <!-- Email Field -->
      <BaseInput
        id="register-email"
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
        id="register-password"
        v-model="password"
        type="password"
        label="Password"
        placeholder="Minimum 8 characters"
        :error="passwordError"
        required
        autocomplete="new-password"
      />

      <!-- Role Selection Toggle (Premium visual choices) -->
      <div class="role-selection-group">
        <span class="role-group-label">I want to:</span>
        
        <div class="role-cards">
          <!-- Customer Role Card -->
          <label :class="['role-card', { 'role-card-active': role === 'customer' }]">
            <input
              type="radio"
              v-model="role"
              value="customer"
              class="sr-only"
            />
            <span class="role-title">Buy Products</span>
            <span class="role-description">Find & purchase premium items</span>
          </label>

          <!-- Seller Role Card -->
          <label :class="['role-card', { 'role-card-active': role === 'seller' }]">
            <input
              type="radio"
              v-model="role"
              value="seller"
              class="sr-only"
            />
            <span class="role-title">Sell Products</span>
            <span class="role-description">Open a store & manage sales</span>
          </label>
        </div>
      </div>

      <!-- Submit CTA -->
      <BaseButton
        type="submit"
        :loading="authStore.loading"
        fullWidth
        class="submit-cta"
      >
        Create Account
      </BaseButton>
    </form>
  </div>
</template>

<style scoped>
.register-form-container {
  width: 100%;
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.role-selection-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
  text-align: left;
}

.role-group-label {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.role-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.role-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 2px solid var(--color-border);
  background-color: var(--color-surface);
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.role-card:hover {
  border-color: var(--color-primary);
  background-color: rgba(15, 61, 94, 0.02);
}

.role-card-active {
  border-color: var(--color-primary);
  background-color: rgba(15, 61, 94, 0.05) !important;
  box-shadow: 0 0 0 1px var(--color-primary);
}

.role-title {
  font-family: var(--font-sans);
  font-size: 0.925rem;
  font-weight: 700;
  color: var(--color-text-h);
}

.role-description {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--color-muted);
  line-height: 125%;
}

.submit-cta {
  margin-top: 8px;
}

/* Screen reader utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>

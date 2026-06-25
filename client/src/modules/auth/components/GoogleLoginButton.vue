<script setup lang="ts">
import BaseButton from '../../../components/ui/BaseButton.vue';

/**
 * GoogleLoginButton Component
 * Renders an accessible, officially-branded Google OAuth button.
 */
defineProps<{
  loading?: boolean;
  disabled?: boolean;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <BaseButton
    variant="secondary"
    :loading="loading"
    :disabled="disabled"
    fullWidth
    @click="$emit('click')"
    class="google-login-btn"
    aria-label="Continue with Google"
  >
    <!-- Official Google G Logo -->
    <svg
      class="google-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v8.89h12.66c-.55 2.92-2.19 5.39-4.67 7.05l7.24 5.61C43.5 35.88 46.5 30.47 46.5 24z"/>
      <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.24-5.61c-2.01 1.35-4.59 2.17-8.65 2.17-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
    <span class="btn-text">Continue with Google</span>
  </BaseButton>
</template>

<style scoped>
.google-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px !important;
  border-color: var(--color-border) !important;
  transition: all 0.25s ease;
}

.google-login-btn:hover:not(:disabled) {
  border-color: var(--color-primary) !important;
  background-color: rgba(15, 61, 94, 0.02) !important;
}

.google-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.btn-text {
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 0.925rem;
  color: var(--color-text-h);
}
</style>

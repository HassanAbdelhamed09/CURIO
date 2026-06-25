<script setup lang="ts">
/**
 * BaseButton Component
 * A highly accessible, premium button matching the deep navy design system.
 */
interface Props {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  fullWidth: false,
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'base-button',
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-full-width': fullWidth, 'btn-loading': loading }
    ]"
  >
    <!-- Visual Spinner during loading state -->
    <span v-if="loading" class="spinner" aria-hidden="true"></span>
    
    <!-- Content Slot -->
    <span :class="{ 'text-transparent': loading }" class="btn-content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-family: var(--font-sans);
  font-weight: 600;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  white-space: nowrap;
  user-select: none;
  box-sizing: border-box;
}

/* Accessibility: Visible focus rings on keyboard navigation */
.base-button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Width Variant */
.btn-full-width {
  width: 100%;
}

/* Size Variants */
.btn-sm {
  padding: 8px 14px;
  font-size: 0.875rem;
  border-radius: var(--radius-sm);
}

.btn-md {
  padding: 12px 20px;
  font-size: 0.95rem;
  border-radius: var(--radius-md);
}

.btn-lg {
  padding: 16px 28px;
  font-size: 1.05rem;
  border-radius: var(--radius-md);
}

/* Style/Color Variants */
.btn-primary {
  background-color: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-secondary {
  background-color: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-bg);
  border-color: var(--color-text-h);
}

.btn-ghost {
  background-color: transparent;
  color: var(--color-text);
}

.btn-ghost:hover:not(:disabled) {
  background-color: rgba(15, 61, 94, 0.06);
  color: var(--color-primary);
}

.btn-danger {
  background-color: var(--color-error);
  color: #ffffff;
  border-color: var(--color-error);
}

.btn-danger:hover:not(:disabled) {
  background-color: #dc2626;
  border-color: #dc2626;
}

/* Loader Styles */
.spinner {
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.btn-secondary .spinner {
  border-color: rgba(15, 61, 94, 0.1);
  border-top-color: var(--color-primary);
}

.text-transparent {
  color: transparent !important;
}

.btn-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue';

/**
 * BaseAlert Component
 * Beautifully styled banners with type-specific icon representations and close support.
 */
interface Props {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  closable?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'info',
  title: '',
  closable: false,
});

const isVisible = ref(true);

const handleClose = () => {
  isVisible.value = false;
};
</script>

<template>
  <div
    v-if="isVisible"
    :class="['base-alert', `alert-${type}`]"
    role="alert"
    aria-live="polite"
  >
    <div class="alert-body">
      <!-- Custom CSS Indicators for Icons -->
      <div class="alert-icon-container" aria-hidden="true">
        <span :class="['alert-icon', `icon-${type}`]"></span>
      </div>

      <div class="alert-text">
        <h4 v-if="title" class="alert-title">{{ title }}</h4>
        <p class="alert-message">{{ message }}</p>
      </div>
    </div>

    <!-- Dismiss CTA -->
    <button
      v-if="closable"
      type="button"
      class="close-button"
      @click="handleClose"
      aria-label="Dismiss alert"
    >
      <span class="close-cross" aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<style scoped>
.base-alert {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 18px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  margin-bottom: 16px;
  box-sizing: border-box;
  text-align: left;
}

.alert-body {
  display: flex;
  gap: 12px;
}

.alert-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

/* CSS-only clean icons for various alert levels */
.alert-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
}

.icon-info {
  background-color: var(--color-info);
}
.icon-info::before {
  content: "i";
  color: white;
  font-weight: bold;
  font-family: var(--font-sans);
  font-size: 11px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.icon-success {
  background-color: var(--color-success);
}
.icon-success::before {
  content: "✓";
  color: white;
  font-weight: bold;
  font-size: 11px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.icon-warning {
  background-color: var(--color-warning);
}
.icon-warning::before {
  content: "!";
  color: white;
  font-weight: bold;
  font-size: 11px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.icon-error {
  background-color: var(--color-error);
}
.icon-error::before {
  content: "✕";
  color: white;
  font-weight: bold;
  font-size: 9px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.alert-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.alert-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: currentColor;
}

.alert-message {
  margin: 0;
  font-size: 0.875rem;
  line-height: 145%;
  color: currentColor;
  opacity: 0.9;
}

/* Color Theming */
.alert-info {
  background-color: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.15);
  color: #1e40af;
}

.alert-success {
  background-color: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.15);
  color: #065f46;
}

.alert-warning {
  background-color: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.15);
  color: #92400e;
}

.alert-error {
  background-color: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.15);
  color: #991b1b;
}

/* Dark theme overrides for alert readability */
@media (prefers-color-scheme: dark) {
  .alert-info {
    color: #93c5fd;
    background-color: rgba(59, 130, 246, 0.12);
  }
  .alert-success {
    color: #6ee7b7;
    background-color: rgba(16, 185, 129, 0.12);
  }
  .alert-warning {
    color: #fcd34d;
    background-color: rgba(245, 158, 11, 0.12);
  }
  .alert-error {
    color: #fca5a5;
    background-color: rgba(239, 68, 68, 0.12);
  }
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: currentColor;
  opacity: 0.6;
  padding: 2px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  margin-top: -2px;
  margin-right: -4px;
}

.close-button:hover {
  opacity: 1;
}

.close-button:focus-visible {
  outline: 2px solid currentColor;
}

.close-cross {
  font-size: 1.25rem;
  line-height: 1;
}
</style>

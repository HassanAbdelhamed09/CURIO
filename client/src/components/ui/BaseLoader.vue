<script setup lang="ts">
/**
 * BaseLoader Component
 * Flexible indicator supporting fullscreen overlays, page content blockades, or small inline context indicators.
 */
interface Props {
  fullscreen?: boolean;
  inline?: boolean;
  text?: string;
}

withDefaults(defineProps<Props>(), {
  fullscreen: false,
  inline: false,
  text: 'Loading...',
});
</script>

<template>
  <div
    :class="[
      'base-loader-container',
      { 'fullscreen-overlay': fullscreen, 'inline-mode': inline }
    ]"
    role="alert"
    aria-busy="true"
  >
    <div class="loader-spinner-wrapper">
      <!-- Spinner animation ring -->
      <span class="loader-spinner" aria-hidden="true"></span>
      <!-- Screen reader text -->
      <span class="sr-only">{{ text }}</span>
    </div>
    
    <p v-if="text && !inline" class="loader-text">
      {{ text }}
    </p>
  </div>
</template>

<style scoped>
.base-loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  box-sizing: border-box;
}

/* Fullscreen Overlay Styles */
.fullscreen-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(11, 15, 25, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 9999;
  padding: 0;
}

/* Inline Mode Styles */
.inline-mode {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: 8px;
}

.loader-spinner-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-spinner {
  display: block;
  width: 2.25rem;
  height: 2.25rem;
  border: 3px solid rgba(15, 61, 94, 0.1);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.inline-mode .loader-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border-width: 2px;
}



.loader-text {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  letter-spacing: 0.2px;
}

/* Screen reader only utility (A11y) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

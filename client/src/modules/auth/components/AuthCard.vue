<script setup lang="ts">
/**
 * AuthCard Component
 * A premium container for authentication forms featuring elegant paddings and shadows.
 */
</script>

<template>
  <div class="auth-card">
    <slot />
  </div>
</template>

<style scoped>
.auth-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: 32px 40px;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  transition: all 0.3s ease;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px 20px;
    border-radius: var(--radius-md);
    border: none;
    box-shadow: none;
    background-color: transparent;
  }
}
</style>

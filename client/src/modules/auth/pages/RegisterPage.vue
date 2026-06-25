<script setup lang="ts">
import { useRouter } from 'vue-router';
import AuthCard from '../components/AuthCard.vue';
import RegisterForm from '../components/RegisterForm.vue';

const router = useRouter();

const handleSuccess = () => {
  router.push({ name: 'profile' });
};
</script>

<template>
  <div class="register-page-view">
    <AuthCard>
      <!-- Title & Branding -->
      <header class="auth-header">
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Join our premium e-commerce marketplace today</p>
      </header>

      <!-- Modular Registration Form -->
      <RegisterForm @success="handleSuccess" />

      <!-- Navigation Linkages -->
      <footer class="auth-footer">
        <p class="footer-text">
          Already have an account? 
          <router-link to="/auth/login" class="auth-link">
            Sign in
          </router-link>
        </p>
      </footer>
    </AuthCard>
  </div>
</template>

<style scoped>
.register-page-view {
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

.auth-footer {
  margin-top: 28px;
  border-top: 1px solid var(--color-border);
  padding-top: 20px;
}

.footer-text {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-muted);
  margin: 0;
}

.auth-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 700;
  transition: color 0.2s;
}

.auth-link:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

.auth-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>

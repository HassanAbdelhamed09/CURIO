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
        <span class="auth-eyebrow">MEMBER PORTAL // CREATION</span>
        <h1 class="auth-title">Establish Registry</h1>
        <p class="auth-subtitle">Join the Aetheris circle to curate your personal archive</p>
      </header>

      <!-- Modular Registration Form -->
      <RegisterForm @success="handleSuccess" />

      <!-- Navigation Linkages -->
      <footer class="auth-footer">
        <p class="footer-text">
          Already registered in the archive? 
          <router-link to="/auth/login" class="auth-link">
            Access Portal
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

.auth-footer {
  margin-top: 32px;
  border-top: 1px solid var(--color-border);
  padding-top: 24px;
}

.footer-text {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--color-text);
  margin: 0;
  text-align: left;
}

.auth-link {
  color: var(--color-primary);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  transition: all 0.2s;
  border-bottom: 1px solid transparent;
  display: inline-block;
  margin-left: 4px;
}

.auth-link:hover {
  color: var(--color-text-h);
  border-bottom-color: var(--color-text-h);
}

.auth-link:focus-visible {
  outline: 1px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
